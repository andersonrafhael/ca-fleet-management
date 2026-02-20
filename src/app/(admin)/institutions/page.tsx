'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { DataTable } from '@/components/data-table/DataTable'
import type { ColumnDef } from '@tanstack/react-table'

interface Institution { id: string; name: string; city?: string; active: boolean }

const columns: ColumnDef<Institution>[] = [
    {
        accessorKey: 'name',
        header: 'Nome',
        cell: ({ row }) => (
            <Link href={`/institutions/${row.original.id}`} className="font-medium text-[#0000FF] hover:underline">
                {row.original.name}
            </Link>
        ),
    },
    {
        accessorKey: 'city',
        header: 'Cidade',
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
            <Link href={`/institutions/${row.original.id}`} className="text-xs text-slate-500 hover:text-[#0000FF] transition-colors">
                Editar →
            </Link>
        ),
    },
]

export default function InstitutionsPage() {
    const [data, setData] = useState<Institution[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/v1/institutions').then(r => r.json()).then(d => { setData(d); setLoading(false) })
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Instituições</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Destinos das rotas universitárias</p>
                </div>
                <Link href="/institutions/new" className="inline-flex items-center gap-2 rounded-xl bg-[#0000FF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0000DD] hover:shadow-md hover:shadow-blue-500/20 transition-all duration-200">
                    <PlusIcon className="h-4 w-4" /> Nova instituição
                </Link>
            </div>

            <DataTable data={data} columns={columns} loading={loading} searchColumn="name" searchPlaceholder="Buscar por nome…" pageSize={10} />
        </div>
    )
}
