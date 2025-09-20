'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'
import { supabase } from '../../../lib/supabaseClient'

export default function Navbar() {
  const { user, role, loading } = useUser()
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <nav className="bg-red-600/95 text-white px-4 py-2 shadow-sm sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-red-600/80">
        <div className="mx-auto max-w-6xl w-full flex items-center justify-between">
          <div className="h-6 w-32 bg-red-500/50 rounded animate-pulse"></div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-16 bg-red-500/50 rounded animate-pulse"></div>
            <div className="h-8 w-20 bg-red-500/50 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-blue-600/95 text-white px-4 py-2 shadow-sm sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-blue-600/80">
      <div className="mx-auto max-w-6xl w-full flex items-center justify-between">
        <Link href="/" className="font-bold tracking-tight text-lg hover:text-blue-100 transition-colors">
          RLS Guard Dog
        </Link>
        
        <div className="flex items-center gap-6">
          {!user ? (
            <>
              <Link 
                href="/login" 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/login' 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
                }`}
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="px-4 py-1.5 rounded-md text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {role === 'teacher' ? (
                <Link 
                  href="/teacher" 
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    pathname.startsWith('/teacher')
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
                  }`}
                >
                  Teacher Dashboard
                </Link>
              ) : (
                <Link 
                  href="/dashboard" 
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    pathname === '/dashboard'
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
                  }`}
                >
                  My Dashboard
                </Link>
              )}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-700/50 hover:text-white transition-colors">
                  <span>Account</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}