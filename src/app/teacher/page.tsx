'use client'

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabaseClient"
import { useUser } from "../context/UserContext"

type ProgressRow = {
    id: string
    lesson: string
    score: number
    created_at: string
    student_email?: string | null
    student_id?: string
}

export default function TeacherDashboard() {
    const { user } = useUser();
    const [progress, setProgress] = useState<ProgressRow[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editLesson, setEditLesson] = useState("");
    const [editScore, setEditScore] = useState("");

    useEffect(() => {
        const fetchProgress = async () => {
            if(!user) return;
            const { data, error } = await supabase
                .from("progress")
                .select('id, lesson, score, created_at, student_email')

            if(error) {
                console.error(error);
            } else {
                setProgress((data ?? []) as ProgressRow[]);
            }
        }
        fetchProgress();
    }, [user]);

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from("progress")
            .delete()
            .eq("id", id);
        
        if(error) {
            console.error(error);
            alert("Error deleting progress: " + error.message);
        } else {
            setProgress(progress.filter((p) => p.id !== id));
        }
    };

    const startEdit = (p: ProgressRow) => {
        setEditingId(p.id);
        setEditLesson(p.lesson);
        setEditScore(String(p.score));
    };

    const handleUpdate = async (id: string) => {
        const { error } = await supabase
            .from("progress")
            .update({ lesson: editLesson, score: Number(editScore) })
            .eq("id", id);
        
        if(error) {
            console.error(error);
            alert("Error updating progress: " + error.message);
        } else {
            setProgress(progress.map((p) => p.id === id ? { ...p, lesson: editLesson, score: Number(editScore) } as ProgressRow : p));
            setEditingId(null);
        }
    };

    if(!user) {
        return <p className="text-center mt-10">Please login as a teacher</p>
    }

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 border rounded-2xl bg-white/80 shadow-sm backdrop-blur dark:bg-gray-800/80 dark:border-gray-700">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Teacher Dashboard</h2>
            </div>

            {progress.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">No progress found</p>
            ) : (
                <table className="table-auto border-collapse border w-full text-gray-900 dark:text-gray-100 dark:border-gray-700">
                    <thead>
                        <tr className="bg-gray-100/70 dark:bg-gray-700/70">
                            <th className="border px-4 py-2 text-left text-sm font-semibold tracking-wide dark:border-gray-700">Student Email</th>
                            <th className="border px-4 py-2 text-left text-sm font-semibold tracking-wide dark:border-gray-700">Lesson</th>
                            <th className="border px-4 py-2 text-left text-sm font-semibold tracking-wide dark:border-gray-700">Score</th>
                            <th className="border px-4 py-2 text-left text-sm font-semibold tracking-wide dark:border-gray-700">Date</th>
                            <th className="border px-4 py-2 dark:border-gray-700 w-[120px] text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {progress.map((p: ProgressRow) => (
                            <tr key={p.id} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50/60 dark:odd:bg-gray-900 dark:even:bg-gray-800 dark:hover:bg-gray-700/60 transition-colors">
                                <td className="border px-4 py-2 dark:border-gray-700 max-w-[240px] truncate text-gray-900 dark:text-gray-100">{p.student_email || p.student_id || '—'}</td>
                                <td className="border px-4 py-2 dark:border-gray-700">
                                    {editingId === p.id ? (
                                        <input
                                            type="text"
                                            value={editLesson}
                                            onChange={(e) => setEditLesson(e.target.value)}
                                            className="border p-1 w-full max-w-[160px] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                                        />
                                    ) : (
                                        <span className="inline-block max-w-[160px] truncate align-middle">{p.lesson}</span>
                                    )}
                                </td>
                                <td className="border px-4 py-2 dark:border-gray-700">
                                    {editingId === p.id ? (
                                        <input
                                            type="number"
                                            value={editScore}
                                            onChange={(e) => setEditScore(e.target.value)}
                                            className="border p-1 w-full max-w-[90px] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                                        />
                                    ) : (
                                        p.score
                                    )}
                                </td>
                                <td className="border px-4 py-2 dark:border-gray-700">{new Date(p.created_at).toLocaleDateString()}</td>
                                <td className="border px-4 py-2 dark:border-gray-700 w-[120px]">
                                    <div className="flex flex-col items-stretch gap-2">
                                        {editingId === p.id ? (
                                            <button
                                            onClick={() => handleUpdate(p.id)}
                                            className="bg-green-600 text-white py-1 px-2 text-xs rounded hover:bg-green-700 focus:outline-none shadow-sm"
                                            style={{ display: "inline-block" }}
                                            >
                                            Save
                                            </button>
                                        ) : (
                                            <button
                                            onClick={() => startEdit(p)}
                                            className="bg-yellow-500 text-black py-1 px-2 text-xs rounded hover:bg-yellow-600 focus:outline-none shadow-sm"
                                            style={{ display: "inline-block" }}
                                            >
                                            Edit
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="bg-red-600 text-white py-1 px-2 text-xs rounded hover:bg-red-700 focus:outline-none shadow-sm"
                                            style={{ display: "inline-block" }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}