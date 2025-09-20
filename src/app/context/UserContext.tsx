'use client'

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../../../lib/supabaseClient"
import type { User } from "@supabase/supabase-js"

type UserRole = 'student' | 'teacher' | null

type UserContextType = {
    user: User | null
    loading: boolean
    role: UserRole
    setRole: (role: UserRole) => void
}

const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
    role: null,
    setRole: () => {}
})

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [role, setRole] = useState<UserRole>(null)

    useEffect(() => {
        const fetchUserAndRole = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                setUser(session?.user ?? null)
                
                if (session?.user) {
                    const { data: userData, error } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', session.user.id)
                        .single()
                    
                    if (!error && userData) {
                        setRole(userData.role || 'student')
                    } else {
                        setRole('student')
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserAndRole()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null)
                if (session?.user) {
                    const { data: userData } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', session.user.id)
                        .single()
                    
                    setRole(userData?.role || 'student')
                } else {
                    setRole(null)
                }
            }
        )

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    return (
        <UserContext.Provider value={{ user, loading, role, setRole }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)