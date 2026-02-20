'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { DataTable } from '@/components/data-table/DataTable'
import type { ColumnDef } from '@tanstack/react-table'

interface Driver { id: string; name: string; cpf: string; cnh: string; cnhCategory: string; phone?: string; status: string }

const STATUS_COLORS: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    vacation: 'bg-blue-100 text-blue-700',
    inactive: 'bg-slate-100 text-slate-600',
}
const STATUS_LABELS: Record<string, string> = {
    active: 'Ativo',
    vacation: 'Férias/Licença',
    inactive: 'Inativo',
}

const columns: ColumnDef<Driver>[] = [
    {
        accessorKey: 'name',
        header: 'Nome',
        cell: ({ row }) => (
            <Link href={`/drivers/${row.original.id}`} className="font-medium text-[#0000FF] hover:underline">
                {row.original.name}
            </Link>
        ),
    },
    {
        id: 'cnh',
        header: 'CNH / Cat',
        cell: ({ row }) => (
            <div>
                <span className="font-mono text-xs">{row.original.cnh}</span>
                <span className="ml-2 inline-flex border border-slate-300 px-1 py-0.5 rounded text-[10px] font-bold text-slate-600">
                    CAT {row.original.cnhCategory}
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'phone',
        header: 'Contato',
        cell: ({ getValue }) => getValue<string>() || '—',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
            const s = getValue<string>()
            return (
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[s]}`}>
                    {STATUS_LABELS[s] || s}
                </span>
            )
        },
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
            <Link href={`/drivers/${row.original.id}`} className="text-xs text-slate-500 hover:text-[#0000FF] transition-colors">
                Editar →
            </Link>
        ),
    },
]

export default function DriversPage() {
    const [data, setData] = useState<Driver[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/v1/drivers').then(r => r.json()).then(d => { setData(d); setLoading(false) })
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Motoristas</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Equipe de condutores da frota</p>
                </div>
                <Link href="/drivers/new" className="inline-flex items-center gap-2 rounded-xl bg-[#0000FF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0000DD] hover:shadow-md hover:shadow-blue-500/20 transition-all duration-200">
                    <PlusIcon className="h-4 w-4" /> Novo motorista
                </Link>
            </div>

            <DataTable data={data} columns={columns} loading={loading} searchColumn="name" searchPlaceholder="Buscar por nome…" pageSize={10} />
        </div>
    )
}
