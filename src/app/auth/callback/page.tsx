'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../../../lib/supabaseClient"

export default function AuthCallback() {
    const router = useRouter()

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if(event === 'SIGNED_IN' && session) {
                router.replace("/profile");
            }
        });

        supabase.auth.getSession().then(({ data }) => {
            if(data.session) {
                router.replace("/profile");
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        }
    }, [router])

    return <p>Completing sign-in...</p>
}