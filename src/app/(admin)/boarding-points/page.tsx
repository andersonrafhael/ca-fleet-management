'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { DataTable } from '@/components/data-table/DataTable'
import type { ColumnDef } from '@tanstack/react-table'

interface BoardingPoint { id: string; name: string; address?: string; active: boolean }

const columns: ColumnDef<BoardingPoint>[] = [
    {
        accessorKey: 'name',
        header: 'Nome do Ponto',
        cell: ({ row }) => (
            <Link href={`/boarding-points/${row.original.id}`} className="font-medium text-[#0000FF] hover:underline">
                {row.original.name}
            </Link>
        ),
    },
    {
        accessorKey: 'address',
        header: 'Referência',
        cell: ({ getValue }) => getValue<string>() || '—',
    },
    {
        accessorKey: 'active',
        header: 'Status',
        cell: ({ getValue }) =>
            getValue<boolean>() ? (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Ativo</span>
            ) : (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Inativo</span>
            ),
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
            <Link href={`/boarding-points/${row.original.id}`} className="text-xs text-slate-500 hover:text-[#0000FF] transition-colors">
                Editar →
            </Link>
        ),
    },
]

export default function BoardingPointsPage() {
    const [data, setData] = useState<BoardingPoint[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/v1/boarding-points').then(r => r.json()).then(d => { setData(d); setLoading(false) })
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Pontos de Embarque</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Locais de parada das rotas</p>
                </div>
                <Link href="/boarding-points/new" className="inline-flex items-center gap-2 rounded-lg bg-[#0000FF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0000CC] transition-colors">
                    <PlusIcon className="h-4 w-4" /> Novo ponto
                </Link>
            </div>

            <DataTable data={data} columns={columns} loading={loading} searchColumn="name" searchPlaceholder="Buscar por nome…" pageSize={10} />
        </div>
    )
}
