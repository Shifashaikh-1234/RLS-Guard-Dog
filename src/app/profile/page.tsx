'use client'

import { useUser } from "../../../lib/useUser"
import { supabase } from "../../../lib/supabaseClient"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProfilePage() {
    const { user, loading } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    }

    useEffect(() => {
        if(!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    if(loading) return <p>Loading...</p>;

    if(!user) {
        return null;
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded-2xl bg-white/80 shadow-sm backdrop-blur dark:bg-gray-800/80 dark:text-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Profile</h2>
            <p className="mb-2 text-gray-900 dark:text-gray-100"><strong>Email:</strong> {user.email}</p>
            <p className="mb-2 text-gray-900 dark:text-gray-100"><strong>Role:</strong> {user.user_metadata?.role ?? 'N/A'}</p>
            <button 
                onClick={handleLogout}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
                Logout
            </button>
        </div>
    )
}