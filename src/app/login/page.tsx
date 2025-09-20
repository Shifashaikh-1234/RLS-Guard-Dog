'use client'

import { useState } from "react"
import { supabase } from "../../../lib/supabaseClient"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/auth/callback',
            },
        })
        if (error) {
            setMessage(error.message)
        } else {
            setMessage("Check your email for the login link!")
        }
        setLoading(false)
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded-2xl bg-white/80 shadow-sm backdrop-blur dark:bg-gray-800/80 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Login</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">We’ll email you a magic link to sign in.</p>
            <form onSubmit={handleLogin} className="space-y-4">
                <input 
                    type="email" 
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60" 
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60 dark:bg-gray-700 dark:hover:bg-gray-600"
                >    
                    {loading ? "Loading..." : "Send Magic Link"}
                </button>
            </form>
            {message && <p className="mt-4 text-sm text-gray-700 dark:text-gray-100">{message}</p>}
        </div>
    )
}