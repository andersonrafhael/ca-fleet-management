'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { BoardingPointForm } from '@/components/forms/BoardingPointForm'
import type { BoardingPointFormValues } from '@/lib/schemas/support'

export default function NewBoardingPointPage() {
    const router = useRouter()
    const [submitError, setSubmitError] = useState<string | null>(null)

    async function handleSubmit(values: BoardingPointFormValues) {
        setSubmitError(null)
        const res = await fetch('/api/v1/boarding-points', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        })

        if (!res.ok) {
            setSubmitError('Ocorreu um erro ao cadastrar o ponto.')
            return
        }

        router.push('/boarding-points')
        router.refresh()
    }

    return (
        <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/boarding-points" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors">
                    <ArrowLeftIcon className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Novo Ponto de Embarque</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Adicione um novo local de parada</p>
                </div>
            </div>

            {submitError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {submitError}
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <BoardingPointForm onSubmit={handleSubmit} onCancel={() => router.push('/boarding-points')} />
            </div>
        </div>
    )
}
