'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, AlertCircleIcon, CheckCircle2Icon, NavigationIcon } from 'lucide-react'
import { OPERATION_STATUS_COLORS, OPERATION_STATUS_LABELS } from '@/lib/schemas/operation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Trip { id: string; route: any; vehicle: any; driver: any; status: string; departureTime: string; scheduledCount: number; checkedInCount: number }
interface OperationDay { id: string; date: string; status: string; trips: Trip[] }

export default function OperationDayDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [data, setData] = useState<OperationDay | null>(null)
    const [loading, setLoading] = useState(true)
    const [publishing, setPublishing] = useState(false)

    useEffect(() => {
        fetch(`/api/v1/operation-days/${id}`)
            .then(r => { if (!r.ok) throw new Error(); return r.json() })
            .then(d => { setData(d); setLoading(false) })
            .catch(() => router.replace('/operation-days'))
    }, [id, router])

    async function handlePublish() {
        setPublishing(true)
        const res = await fetch(`/api/v1/operation-days/${id}/publish`, { method: 'POST' })
        if (res.ok) {
            setData(await res.json())
            router.refresh()
        }
        setPublishing(false)
    }

    if (loading) return <div className="flex justify-center py-20"><span className="animate-pulse">Carregando…</span></div>
    if (!data) return null

    const dateObj = new Date(data.date + 'T12:00:00')
    const isDraft = data.status === 'draft'

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/operation-days" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors">
                        <ArrowLeftIcon className="h-4 w-4" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 capitalize">
                            {format(dateObj, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                        </h2>
                        <div className="mt-1 flex items-center gap-2">
                            <span className={`inline-flex px-2 py-0.5 rounded textxs font-bold uppercase tracking-wider ${OPERATION_STATUS_COLORS[data.status]}`}>
                                {OPERATION_STATUS_LABELS[data.status] || data.status}
                            </span>
                            <span className="text-sm text-slate-500">{data.trips?.length || 0} viagens alocadas</span>
                        </div>
                    </div>
                </div>

                {isDraft && (
                    <button
                        onClick={handlePublish}
                        disabled={publishing || (data.trips?.length || 0) === 0}
                        className="rounded-lg bg-[#0000FF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0000CC] disabled:opacity-60 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        {publishing ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <CheckCircle2Icon className="h-4 w-4" />}
                        Publicar Dia de Operação
                    </button>
                )}
            </div>

            {isDraft && (data.trips?.length || 0) === 0 && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
                    <AlertCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-blue-800">Dia em planejamento</p>
                        <p className="text-xs text-blue-600 mt-1">Nenhuma rota alocada. Use o módulo de rotas para gerar viagens ou importe um modelo anterior.</p>
                    </div>
                </div>
            )}

            {/* Trips list */}
            <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 flex justify-between items-center">
                    Viagens Programadas
                    {isDraft && <button className="text-xs font-semibold text-[#0000FF] hover:underline">+ Adicionar viagem</button>}
                </h3>

                {data.trips?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {data.trips.map(trip => (
                            <div key={trip.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-[#0000FF]/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex gap-4 items-start">
                                    <div className="p-3 bg-slate-50 rounded-lg text-slate-500 shrink-0">
                                        <NavigationIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-800">{trip.route.name}</h4>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${trip.route.direction === 'going' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {trip.route.direction === 'going' ? 'IDA' : 'VOLTA'}
                                            </span>
                                        </div>
                                        <div className="mt-1 text-sm text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                                            <span><strong>Partida:</strong> {format(new Date(trip.departureTime), 'HH:mm')}</span>
                                            <span><strong>Veículo:</strong> {trip.vehicle.licensePlate} ({trip.vehicle.capacity} lugares)</span>
                                            <span><strong>Motorista:</strong> {trip.driver.name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col justify-between items-end gap-2 md:w-32">
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Estimativa</p>
                                        <p className="text-lg font-bold text-[#0000FF]">{trip.scheduledCount} <span className="text-sm font-normal text-slate-500">alunos</span></p>
                                    </div>
                                    {isDraft ? (
                                        <button className="text-xs font-medium text-slate-400 hover:text-[#0000FF] transition-colors">Editar / Trocar</button>
                                    ) : (
                                        <Link href={`/trips/${trip.id}`} className="text-xs font-medium text-slate-400 hover:text-[#0000FF] transition-colors">Ver embarque →</Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border text-center border-slate-200 border-dashed rounded-xl p-10 text-slate-500">
                        Nenhuma viagem cadastrada para esta data.
                    </div>
                )}
            </div>
        </div>
    )
}
