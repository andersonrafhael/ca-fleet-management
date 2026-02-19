'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, FlagIcon, AlertCircleIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'

const closeSchema = z.object({
    kmStart: z.coerce.number().min(0, 'Valor inválido'),
    kmEnd: z.coerce.number().min(0, 'Valor inválido'),
    occurrences: z.array(z.string()).optional()
}).refine(data => data.kmEnd >= data.kmStart, {
    message: 'KM Final deve ser maior ou igual ao KM Inicial',
    path: ['kmEnd']
})
type CloseFormValues = z.infer<typeof closeSchema>

const OCCURRENCES = [
    { id: 'delay', label: 'Atraso na saída' },
    { id: 'traffic', label: 'Trânsito intenso' },
    { id: 'maintenance', label: 'Problema mecânico leve' },
    { id: 'incident', label: 'Incidente com passageiro' },
]

export default function TripClosePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [trip, setTrip] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CloseFormValues>({
        resolver: zodResolver(closeSchema),
        defaultValues: { occurrences: [] },
    })
    const selectedOccurrences = watch('occurrences') || []

    useEffect(() => {
        fetch(`/api/v1/trips/${id}`)
            .then(r => { if (!r.ok) throw new Error(); return r.json() })
            .then(d => { setTrip(d); setValue('kmStart', d.vehicle?.currentKm || 0); setLoading(false) })
            .catch(() => router.replace('/operation-days'))
    }, [id, router, setValue])

    async function onSubmit(values: CloseFormValues) {
        setSubmitError(null)
        const res = await fetch(`/api/v1/trips/${id}/close`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        })

        if (!res.ok) {
            setSubmitError('Erro ao encerrar a viagem.')
            return
        }

        // Redirect back to operation day
        router.push(`/operation-days/${trip.operationDayId}`)
    }

    const toggleOccurrence = (occId: string) => {
        if (selectedOccurrences.includes(occId)) {
            setValue('occurrences', selectedOccurrences.filter(o => o !== occId), { shouldValidate: true })
        } else {
            setValue('occurrences', [...selectedOccurrences, occId], { shouldValidate: true })
        }
    }

    if (loading) return <div className="flex justify-center py-20"><span className="animate-pulse">Carregando…</span></div>
    if (!trip) return null

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href={`/trips/${id}`} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors">
                        <ArrowLeftIcon className="h-4 w-4" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Encerrar Viagem</h2>
                        <p className="text-sm text-slate-500 mt-0.5">{trip.route?.name} · {trip.vehicle?.licensePlate}</p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
                <AlertCircleIcon className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <p>
                    <strong>Resumo:</strong> Você registrou <strong>{trip.checkedInCount} presentes</strong> de {trip.scheduledCount} esperados.
                    Preencha os dados finais do hodômetro para concluir.
                </p>
            </div>

            {submitError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{submitError}</div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">KM Inicial *</label>
                        <input
                            type="number"
                            {...register('kmStart')}
                            className={cn(
                                'w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0000FF]/20 focus:border-[#0000FF]',
                                errors.kmStart?.message ? 'border-red-400 bg-red-50' : 'border-slate-300'
                            )}
                        />
                        {errors.kmStart?.message && <p className="mt-1 text-xs text-red-600">{errors.kmStart.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">KM Final *</label>
                        <input
                            type="number"
                            {...register('kmEnd')}
                            className={cn(
                                'w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0000FF]/20 focus:border-[#0000FF]',
                                errors.kmEnd?.message ? 'border-red-400 bg-red-50' : 'border-slate-300'
                            )}
                        />
                        {errors.kmEnd?.message && <p className="mt-1 text-xs text-red-600">{errors.kmEnd.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Ocorrências na viagem (opcional)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {OCCURRENCES.map(occ => {
                            const checked = selectedOccurrences.includes(occ.id)
                            return (
                                <label key={occ.id} className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                                    checked ? "border-[#0000FF] bg-blue-50/50 text-[#0000FF] font-medium" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                                )}>
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleOccurrence(occ.id)}
                                        className="h-4 w-4 rounded border-slate-300 text-[#0000FF] focus:ring-[#0000FF]"
                                    />
                                    <span className="text-sm">{occ.label}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto rounded-lg bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <>
                                <FlagIcon className="h-4 w-4" />
                                Confirmar Encerramento
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
