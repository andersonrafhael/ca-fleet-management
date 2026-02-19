'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { StudentForm } from '@/components/forms/StudentForm'
import type { StudentFormValues } from '@/lib/schemas/student'

interface Institution { id: string; name: string }
interface BoardingPoint { id: string; name: string }

export default function NewStudentPage() {
    const router = useRouter()
    const [institutions, setInstitutions] = useState<Institution[]>([])
    const [boardingPoints, setBoardingPoints] = useState<BoardingPoint[]>([])
    const [loading, setLoading] = useState(true)
    const [submitError, setSubmitError] = useState<string | null>(null)

    useEffect(() => {
        async function loadRefs() {
            const [instRes, bpRes] = await Promise.all([
                fetch('/api/v1/institutions'),
                fetch('/api/v1/boarding-points'),
            ])
            setInstitutions(await instRes.json())
            setBoardingPoints(await bpRes.json())
            setLoading(false)
        }
        loadRefs()
    }, [])

    async function handleSubmit(values: StudentFormValues) {
        setSubmitError(null)
        const res = await fetch('/api/v1/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...values, cpf: values.cpf.replace(/\D/g, '') }),
        })

        if (res.status === 422) {
            const err = await res.json()
            setSubmitError(err.message ?? 'Erro de validação')
            return
        }
        if (!res.ok) {
            setSubmitError('Ocorreu um erro ao cadastrar o aluno. Tente novamente.')
            return
        }

        router.push('/students')
        router.refresh()
    }

    return (
        <div className="max-w-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/students" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors">
                    <ArrowLeftIcon className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Novo aluno</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Preencha os dados do aluno e salvem</p>
                </div>
            </div>

            {submitError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {submitError}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0000FF] border-t-transparent" />
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <StudentForm
                        institutions={institutions}
                        boardingPoints={boardingPoints}
                        onSubmit={handleSubmit}
                        onCancel={() => router.push('/students')}
                    />
                </div>
            )}
        </div>
    )
}
