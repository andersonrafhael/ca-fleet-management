'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { RouteForm } from '@/components/forms/RouteForm'
import type { RouteFormValues } from '@/lib/schemas/support'

interface BoardingPoint { id: string; name: string }

export default function NewRoutePage() {
    const router = useRouter()
    const [boardingPoints, setBoardingPoints] = useState<BoardingPoint[]>([])
    const [loading, setLoading] = useState(true)
    const [submitError, setSubmitError] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/v1/boarding-points').then(r => r.json()).then(d => { setBoardingPoints(d); setLoading(false) })
    }, [])

    async function handleSubmit(values: RouteFormValues) {
        setSubmitError(null)
        const res = await fetch('/api/v1/routes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        })

        if (!res.ok) {
            setSubmitError('Ocorreu um erro ao cadastrar a rota.')
            return
        }

        router.push('/routes')
        router.refresh()
    }

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/routes" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors">
                    <ArrowLeftIcon className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Nova Rota</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Defina o itinerário e os pontos de embarque</p>
                </div>
            </div>

            {submitError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{submitError}</div>
            )}

            {loading ? (
                <div className="flex justify-center py-20"><span className="animate-pulse">Carregando formulário…</span></div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <RouteForm boardingPoints={boardingPoints} onSubmit={handleSubmit} onCancel={() => router.push('/routes')} />
                </div>
            )}
        </div>
    )
}
