'use client'

import { useEffect, useState } from "react"
import { supabase } from "../../../../lib/supabaseClient"

type Progress = {
    id: string;
    lesson: string;
    score: number;
    student_id: string;
}

export default function StudentProgressPage() {
    const [progress, setProgress] = useState<Progress[]>([])
    const [lesson, setLesson] = useState("")
    const [score, setScore] = useState<number | "">("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProgress = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from("progress")
                .select("*")
                .order("created_at", { ascending: false })
            
            if(error) {
                setError(error.message)
            } else {
                setProgress(data || [])
            }
            setLoading(false)
        }

        fetchProgress()
    }, [])

    const addProgress = async (e: React.FormEvent) => {
        e.preventDefault()
        if(!lesson || score === "") return;
        
        const { data, error } = await supabase
            .from("progress")
            .insert({
                lesson,
                score
            })
            .select();

        if(error) {
            setError(error.message)
        } else {
            setProgress((prev) => [...data, ...prev])
            setLesson("")
            setScore("")
        }
    }

    return (
        <div className="max-w-lg mx-auto mt-8 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Student Progress</h2>

            <form onSubmit={addProgress} className="space-y-3 mb-6">
                <input 
                    type="text"
                    placeholder="Lesson name"
                    value={lesson}
                    onChange={(e) => setLesson(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <input 
                    type="number"
                    placeholder="Score"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full border p-2 rounded"
                    required
                />
                <button 
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Loading..." : "Add Progress"}
                </button>
            </form>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : progress.length === 0 ? (
                <p>No progress found</p>
            ) : (
                <ul className="space-y-2">
                    {progress.map((row) => (
                        <li key={row.id} className="border p-2 rounded">
                            <span className="font-semibold">{row.lesson}</span> - Score:{' '}
                            {row.score}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
