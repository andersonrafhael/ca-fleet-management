'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { DataTable } from '@/components/data-table/DataTable'
import type { ColumnDef } from '@tanstack/react-table'

interface Route { id: string; name: string; direction: string; departureTime?: string; active: boolean; boardingPoints?: any[] }

const columns: ColumnDef<Route>[] = [
    {
        accessorKey: 'name',
        header: 'Nome da Rota',
        cell: ({ row }) => (
            <div>
                <Link href={`/routes/${row.original.id}`} className="font-medium text-[#0000FF] hover:underline">
                    {row.original.name}
                </Link>
                <p className="text-xs text-slate-500 mt-0.5">
                    {row.original.boardingPoints?.length || 0} ponto(s) vinculado(s)
                </p>
            </div>
        ),
    },
    {
        accessorKey: 'direction',
        header: 'Sentido',
        cell: ({ getValue }) =>
            getValue<string>() === 'going' ? (
                <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">IDA</span>
            ) : (
                <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-700">VOLTA</span>
            ),
    },
    {
        accessorKey: 'departureTime',
        header: 'Horário',
        cell: ({ getValue }) => getValue<string>() || '—',
    },
    {
        accessorKey: 'active',
        header: 'Status',
        cell: ({ getValue }) =>
            getValue<boolean>() ? (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Ativa</span>
            ) : (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Inativa</span>
            ),
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
            <Link href={`/routes/${row.original.id}`} className="text-xs text-slate-500 hover:text-[#0000FF] transition-colors">
                Editar →
            </Link>
        ),
    },
]

export default function RoutesPage() {
    const [data, setData] = useState<Route[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/v1/routes').then(r => r.json()).then(d => { setData(d); setLoading(false) })
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Rotas e Transportes</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Gerencie os itinerários</p>
                </div>
                <Link href="/routes/new" className="inline-flex items-center gap-2 rounded-xl bg-[#0000FF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0000DD] hover:shadow-md hover:shadow-blue-500/20 transition-all duration-200">
                    <PlusIcon className="h-4 w-4" /> Nova rota
                </Link>
            </div>

            <DataTable data={data} columns={columns} loading={loading} searchColumn="name" searchPlaceholder="Buscar rota…" pageSize={10} />
        </div>
    )
}
