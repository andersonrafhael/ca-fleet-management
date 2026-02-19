'use client'

import { useEffect, useState } from 'react'

// A simple loading gate that ensures MSW is started before any fetch
// In production, renders children immediately (no MSW)
export function MSWProvider({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(process.env.NODE_ENV !== 'development')

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') return

        async function startMSW() {
            const { worker } = await import('@/mocks/browser')
            await worker.start({
                onUnhandledRequest: 'bypass',
                serviceWorker: { url: '/mockServiceWorker.js' },
            })
            setReady(true)
        }

        startMSW()
    }, [])

    // In dev: show spinner until MSW is ready — prevents any fetch before SW is active
    if (!ready) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="space-y-3 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-3 border-[#0000FF] border-t-transparent" />
                    <p className="text-xs text-slate-400">Iniciando ambiente de desenvolvimento…</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
