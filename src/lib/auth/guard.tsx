'use client'

/**
 * RouteGuard — client-side route guard using mock session
 * Redirects unauthenticated/unauthorized users.
 * In production: replace with middleware.ts + httpOnly cookie check.
 */

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getSession, type SessionUser } from '@/lib/auth/session'
import { canAccessPath, getDefaultPath } from '@/lib/auth/rbac'

interface RouteGuardProps {
    children: React.ReactNode
    /** Fallback while checking auth */
    fallback?: React.ReactNode
}

export function RouteGuard({ children, fallback }: RouteGuardProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState<SessionUser | null | 'loading'>('loading')

    useEffect(() => {
        const session = getSession()

        if (!session) {
            router.replace('/login')
            return
        }

        if (!canAccessPath(pathname, session.role)) {
            router.replace(getDefaultPath(session.role))
            return
        }

        setUser(session)
    }, [pathname, router])

    if (user === 'loading') {
        return (
            fallback ?? (
                <div className="flex h-screen items-center justify-center bg-slate-50">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0000FF] border-t-transparent" />
                </div>
            )
        )
    }

    return <>{children}</>
}

/** Hook to access current session user in any client component */
export function useSession(): SessionUser | null {
    const [user, setUser] = useState<SessionUser | null>(null)
    useEffect(() => {
        setUser(getSession())
    }, [])
    return user
}
