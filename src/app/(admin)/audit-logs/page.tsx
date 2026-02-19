'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/data-table/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { HistoryIcon, ShieldCheckIcon } from 'lucide-react'

interface AuditLog {
    id: string
    timestamp: string
    userId: string
    userName: string
    action: string
    entityType: string
    entityId: string
    metadata: any
}

const ACTION_LABELS: Record<string, string> = {
    biometric_checkin_success: 'Check-in Biométrico',
    manual_checkin: 'Check-in Manual',
    operation_day_published: 'Dia Publicado',
    student_created: 'Aluno Cadastrado',
    biometric_enrolled: 'Biometria Registrada',
    vehicle_status_changed: 'Status Veículo Alterado'
}

const columns: ColumnDef<AuditLog>[] = [
    {
        accessorKey: 'timestamp',
        header: 'Data/Hora',
        cell: ({ getValue }) => format(new Date(getValue<string>()), "dd/MM/yyyy HH:mm", { locale: ptBR })
    },
    {
        accessorKey: 'userName',
        header: 'Usuário'
    },
    {
        accessorKey: 'action',
        header: 'Ação',
        cell: ({ getValue }) => {
            const val = getValue<string>()
            return (
                <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {ACTION_LABELS[val] || val}
                </span>
            )
        }
    },
    {
        accessorKey: 'entityType',
        header: 'Módulo',
        cell: ({ getValue }) => <span className="text-slate-500 font-medium">{getValue<string>()}</span>
    },
    {
        accessorKey: 'metadata',
        header: 'Detalhes',
        cell: ({ getValue }) => {
            const meta = getValue<any>()
            if (!meta || Object.keys(meta).length === 0) return '-'
            return <pre className="text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded-md border border-slate-100 overflow-x-auto max-w-[250px]">{JSON.stringify(meta)}</pre>
        }
    },
]

export default function AuditLogsPage() {
    const [data, setData] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/v1/audit-logs?limit=50')
            .then(r => r.json())
            .then(d => { setData(d.data || d); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return <div className="flex justify-center py-20"><span className="animate-pulse">Carregando logs de auditoria…</span></div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-800 text-white rounded-xl shadow-sm">
                        <ShieldCheckIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Logs de Auditoria</h2>
                        <p className="text-sm text-slate-500 mt-0.5">Rastreabilidade completa de ações no sistema</p>
                    </div>
                </div>

                <button className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                    <HistoryIcon className="h-4 w-4" /> Exportar Relatório
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6">
                    <DataTable
                        data={data}
                        columns={columns}
                        searchColumn="userName"
                        searchPlaceholder="Buscar por nome de usuário…"
                        pageSize={20}
                    />
                </div>
            </div>
        </div>
    )
}
