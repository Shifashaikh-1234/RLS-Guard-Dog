import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { anonClient, getAuthedClient, serviceClient } from './helpers/supabaseClients';
import { randomUUID } from 'node:crypto';

type UserInfo = { email: string; password: string; id: string }

const teacher: UserInfo = { email: `teacher_${Date.now()}@test.local`, password: 'Passw0rd!', id: '' }
const studentA: UserInfo = { email: `studentA_${Date.now()}@test.local`, password: 'Passw0rd!', id: '' }
const studentB: UserInfo = { email: `studentB_${Date.now()}@test.local`, password: 'Passw0rd!', id: '' }

async function createUser(email: string, password: string, role: 'student' | 'teacher') {
    const { data, error } = await serviceClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role },
    })
    if(error) throw error;
    return data.user!;
}

async function hardResetProgress() {
    const ZERO_UUID = '00000000-0000-0000-0000-000000000000'
    const { error } = await serviceClient
      .from('progress')
      .delete()
      .neq('id', ZERO_UUID)
  
    if (error) throw error
  }

beforeAll(async () => {
    const t = await createUser(teacher.email, teacher.password, 'teacher');
    const a = await createUser(studentA.email, studentA.password, 'student');
    const b = await createUser(studentB.email, studentB.password, 'student');
    teacher.id = t.id;
    studentA.id = a.id;
    studentB.id = b.id;

    await hardResetProgress();

    const seed = [
        { id: randomUUID(), lesson: 'Seed-A', score: 90, student_id: studentA.id, student_email: studentA.email },
        { id: randomUUID(), lesson: 'Seed-B', score: 80, student_id: studentB.id, student_email: studentB.email },
    ]
    const { error } = await serviceClient.from('progress').insert(seed);
    if(error) throw error;
})

afterAll(async () => {
    await hardResetProgress();
})

describe('RLS Policies', () => {
    it('studentA sees only their own rows, cannot see B', async () => {
        const cA = await getAuthedClient(studentA.email, studentA.password);
        const { data, error } = await cA.from('progress').select('*').order('created_at', { ascending: false });
        expect(error).toBeNull();
        expect(data).toBeTruthy();
        const studentIds = data!.map(r => r.student_id);
        expect(new Set(studentIds)).toEqual(new Set([studentA.id]));
    })

    it('studentA can insert only for self and cannot update B', async () => {
        const cA = await getAuthedClient(studentA.email, studentA.password);
        {
            const { data, error } = await cA.from('progress').insert({
                lesson: 'Self-Insert',
                score: 100,
                student_id: studentA.id,
                student_email: studentA.email,
            }).select()
            expect(error).toBeNull();
            expect(data && data.length).toBe(1);
            expect(data![0].student_id).toBe(studentA.id);
        }

        {
            const { data: bRow } = await serviceClient
                .from('progress')
                .select('id, score')
                .eq('student_id', studentB.id)
                .limit(1)
                .maybeSingle()

            expect(bRow?.id).toBeTruthy()

            const { error: updErr, data: updData } = await cA
                .from('progress')
                .update({ score: 10 })
                .eq('id', bRow!.id)
                .select()

            expect(Boolean(updErr) || (updData?.length ?? 0) === 0).toBe(true)
        }
    })

    it('teacher can read all rows and modify any row', async () => {
        const cT = await getAuthedClient(teacher.email, teacher.password);
        
        const { data: allRows, error } = await cT.from('progress').select('*')
        expect(error).toBeNull();
        expect(allRows && allRows.length).toBeGreaterThanOrEqual(2)

        const targetId = allRows![0].id;
        const { error: updErr, data: updData } = await cT.from('progress').update({ score: 100 }).eq('id', targetId).select()
        expect(updErr).toBeNull();
        expect(updData && updData.length).toBe(1);
        expect(updData![0].score).toBe(100);
    })

    it('teacher can delete progress', async () => {
        const cT = await getAuthedClient(teacher.email, teacher.password)

        const { data: rows } = await cT.from('progress').select('id').limit(1)
        expect(rows && rows.length).toBeGreaterThan(0)
        const delId = rows![0].id

        const { error: delErr, data: delData } = await cT
            .from('progress')
            .delete()
            .eq('id', delId)
            .select()

        expect(delErr).toBeNull()
        expect(delData && delData.length).toBe(1)

        const { data: verify } = await cT.from('progress').select('id').eq('id', delId)
        expect(verify?.length ?? 0).toBe(0)
    })
})