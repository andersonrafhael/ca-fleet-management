'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusIcon, CalendarIcon, FileTextIcon } from 'lucide-react'
import { OPERATION_STATUS_COLORS, OPERATION_STATUS_LABELS } from '@/lib/schemas/operation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface OperationDay {
    id: string
    date: string
    status: string
    tripCount: number
    publishedAt: string | null
    createdAt: string
}

export default function OperationDaysPage() {
    const [data, setData] = useState<OperationDay[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/v1/operation-days?limit=50')
            .then(r => r.json())
            .then(d => { setData(d.data || d); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return <div className="flex justify-center py-20"><span className="animate-pulse">Carregando…</span></div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Dias de Operação</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Visão geral do planejamento diário de rotas</p>
                </div>
                <Link href="/operation-days/new" className="inline-flex items-center gap-2 rounded-lg bg-[#0000FF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0000CC] transition-colors">
                    <PlusIcon className="h-4 w-4" /> Planejar Novo Dia
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        Nenhum dia de operação registrado.
                    </div>
                ) : (
                    data.map(day => {
                        const dateObj = new Date(day.date + 'T12:00:00') // ignore timezones for local date
                        return (
                            <Link key={day.id} href={`/operation-days/${day.id}`} className="group relative block bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-[#0000FF] hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-50 rounded-lg text-[#0000FF]">
                                            <CalendarIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 capitalize">
                                                {format(dateObj, 'EEEE', { locale: ptBR })}
                                            </h3>
                                            <p className="text-sm text-slate-500 font-medium">
                                                {format(dateObj, "dd 'de' MMMM", { locale: ptBR })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${OPERATION_STATUS_COLORS[day.status]}`}>
                                        {OPERATION_STATUS_LABELS[day.status] || day.status}
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                        <FileTextIcon className="h-4 w-4" />
                                        <span>{day.tripCount} viagens</span>
                                    </div>
                                    <span className="text-sm text-[#0000FF] font-medium group-hover:underline">
                                        Ver detalhes →
                                    </span>
                                </div>
                            </Link>
                        )
                    })
                )}
            </div>
        </div>
    )
}
