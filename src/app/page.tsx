'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from './context/UserContext';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      const userRole = user.user_metadata?.role || 'student';
      
      if (userRole === 'teacher') {
        router.push('/teacher');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-blue-500/40 to-cyan-400/40 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-purple-500/30 to-pink-400/30 blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-400/20 to-teal-300/20 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
      </div>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-600/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-300 ring-1 ring-blue-600/20">
            Secure by Supabase Row Level Security
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            RLS Guard Dog
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 dark:text-gray-300 sm:text-lg">
            A clean, secure demo where students view only their own progress and teachers manage the whole classroom.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Get started
              <svg className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              I already have an account
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/70">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-300">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">RLS by Default</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Students see only their own rows; teachers see and manage all. Policies are enforced in the database.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/70">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Student Dashboard</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Students can track their progress and view their own data in a clean, intuitive interface.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/70">
            <div className="mb-3 inline-flex size-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300">👩‍🏫</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Teacher Portal</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Teachers have full visibility and control over all student data and progress.</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
          <Link href="/dashboard" className="rounded-full border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800">Go to Student Dashboard</Link>
          <Link href="/teacher" className="rounded-full border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800">Go to Teacher Dashboard</Link>
        </div>
      </section>
    </div>
  );
}
