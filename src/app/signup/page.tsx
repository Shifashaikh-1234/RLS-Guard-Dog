'use client'

import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"student" | "teacher">("student");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();
    
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { role },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        setLoading(false);

        if(error) {
            setErrorMsg(error.message);
        } else {
            alert("Check your email for the login link!");
            router.push("/login");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6 border rounded-2xl bg-white/80 shadow-sm backdrop-blur dark:bg-gray-800/80 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Sign Up</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">Create your account and choose your role.</p>
            <form onSubmit={handleSignup} className="space-y-4">
                <input 
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                    required
                />
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                    required
                />
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <input 
                            type="radio"
                            name="role"
                            value="student"
                            checked={role === "student"}
                            onChange={() => setRole("student")}
                        />
                        Student
                    </label>
                    <label className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <input 
                            type="radio"
                            name="role"
                            value="teacher"
                            checked={role === "teacher"}
                            onChange={() => setRole("teacher")}
                        />
                        Teacher
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                    {loading ? "Loading..." : "Sign Up"}
                </button>
            </form>
            {errorMsg && <p className="text-red-500 mt-2 dark:text-red-400">{errorMsg}</p>}
        </div>
    );
}