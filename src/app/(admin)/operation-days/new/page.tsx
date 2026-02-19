'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { operationDaySchema, type OperationDayFormValues } from '@/lib/schemas/operation'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

export default function NewOperationDayPage() {
    const router = useRouter()
    const [submitError, setSubmitError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<OperationDayFormValues>({
        resolver: zodResolver(operationDaySchema),
        defaultValues: { date: format(new Date(), 'yyyy-MM-dd') },
    })

    async function onSubmit(values: OperationDayFormValues) {
        setSubmitError(null)
        const res = await fetch('/api/v1/operation-days', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        })

        if (!res.ok) {
            setSubmitError('Ocorreu um erro ao criar o dia de operação.')
            return
        }

        const data = await res.json()
        // Redireciona para o detalhe (wizard)
        router.push(`/operation-days/${data.id}`)
    }

    return (
        <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/operation-days" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors">
                    <ArrowLeftIcon className="h-4 w-4" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Novo Dia de Operação</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Selecione a data para planejar as rotas</p>
                </div>
            </div>

            {submitError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {submitError}
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Data da Operação *</label>
                        <input
                            type="date"
                            {...register('date')}
                            className={cn(
                                'w-full max-w-sm rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0000FF]/20 focus:border-[#0000FF] transition-colors',
                                errors.date?.message ? 'border-red-400 bg-red-50' : 'border-slate-300'
                            )}
                        />
                        {errors.date?.message && <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <Link href="/operation-days" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-[#0000FF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0000CC] disabled:opacity-60 transition-colors flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                'Iniciar Planejamento →'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
