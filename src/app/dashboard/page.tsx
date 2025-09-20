'use client'

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabaseClient"
import { useUser } from "../context/UserContext"

type ProgressRow = {
    id: string
    lesson: string
    score: number
    created_at: string
    student_id?: string
    student_email?: string | null
}

export default function DashboardPage() {
    const { user } = useUser();
    const [progress, setProgress] = useState<ProgressRow[]>([]);
    const [lesson, setLesson] = useState("");
    const [score, setScore] = useState("");

    useEffect(() => {
        const fetchProgress = async () => {
            if(!user) return;
            const { data, error } = await supabase
                .from("progress")
                .select("id, lesson, score, created_at, student_id, student_email")
                .eq("student_id", user.id)
                .order("created_at", { ascending: false })
            
            if(error) {
                console.error(error);
            } else {
                setProgress((data ?? []) as ProgressRow[]);
            }
        }
        fetchProgress();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!user) return;

        const { data, error } = await supabase
            .from("progress")
            .insert([{ lesson, score: Number(score), student_id: user.id, student_email: user.email }])
            .select("id, lesson, score, created_at, student_id, student_email")

        if(error) {
            console.error(error);
            alert("Error adding progress: " + error.message);
        } else {
            setProgress([...(data as ProgressRow[] | null ?? []), ...progress])
            setLesson("");
            setScore("");
        }
    }
    
    if(!user) {
        return <p className="text-center mt-10">Please log in to view your dashboard</p>
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 space-y-6">
            <form onSubmit={handleSubmit} className="p-6 border rounded-2xl bg-white/80 shadow-sm backdrop-blur dark:bg-gray-800/80 dark:border-gray-700">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Add Progress</h2>
                </div>
                <input 
                    type="text"
                    placeholder="Lesson"
                    value={lesson}
                    onChange={(e) => setLesson(e.target.value)}
                    className="block border p-2 mb-2 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                    required
                />
                <input 
                    type="number"
                    placeholder="Score"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="block border p-2 mb-4 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                    required
                />
                <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Submit
                </button>
            </form>
            <div className="p-6 border rounded-2xl bg-white/80 shadow-sm backdrop-blur dark:bg-gray-800/80 dark:border-gray-700">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">My Progress</h2>
                </div>
                {progress.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-300">No progress found</p>
                ) : (
                    <table className="table-auto border-collapse border w-full dark:border-gray-700 text-gray-900 dark:text-gray-100">
                        <thead>
                            <tr className="bg-gray-100/70 dark:bg-gray-700/70">
                                <th className="border px-4 py-2 text-left text-sm font-semibold tracking-wide dark:border-gray-700">Lesson</th>
                                <th className="border px-4 py-2 text-left text-sm font-semibold tracking-wide dark:border-gray-700">Score</th>
                                <th className="border px-4 py-2 text-left text-sm font-semibold tracking-wide dark:border-gray-700">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {progress.map((row) => (
                                <tr key={row.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 hover:bg-blue-50/60 dark:hover:bg-gray-700/60 transition-colors">
                                    <td className="border px-4 py-2 dark:border-gray-700">{row.lesson}</td>
                                    <td className="border px-4 py-2 dark:border-gray-700">{row.score}</td>
                                    <td className="border px-4 py-2 dark:border-gray-700">{new Date(row.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}