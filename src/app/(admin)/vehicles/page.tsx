'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { DataTable } from '@/components/data-table/DataTable'
import { VEHICLE_TYPES } from '@/lib/schemas/support'
import type { ColumnDef } from '@tanstack/react-table'

interface Vehicle { id: string; licensePlate: string; brand: string; model: string; capacity: number; type: string; status: string }

const STATUS_COLORS: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    maintenance: 'bg-orange-100 text-orange-700',
    inactive: 'bg-slate-100 text-slate-600',
}
const STATUS_LABELS: Record<string, string> = {
    active: 'Ativo',
    maintenance: 'Manutenção',
    inactive: 'Inativo',
}

const columns: ColumnDef<Vehicle>[] = [
    {
        accessorKey: 'licensePlate',
        header: 'Placa',
        cell: ({ row }) => (
            <Link href={`/vehicles/${row.original.id}`} className="font-medium text-[#0000FF] hover:underline uppercase">
                {row.original.licensePlate}
            </Link>
        ),
    },
    {
        id: 'model',
        header: 'Veículo',
        cell: ({ row }) => (
            <div>
                <p className="font-medium text-slate-800">{row.original.brand} {row.original.model}</p>
                <p className="text-xs text-slate-500">{VEHICLE_TYPES[row.original.type] || row.original.type} · {row.original.capacity} lugares</p>
            </div>
        ),
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
            <Link href={`/vehicles/${row.original.id}`} className="text-xs text-slate-500 hover:text-[#0000FF] transition-colors">
                Editar →
            </Link>
        ),
    },
]

export default function VehiclesPage() {
    const [data, setData] = useState<Vehicle[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/v1/vehicles').then(r => r.json()).then(d => { setData(d); setLoading(false) })
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Frota de Veículos</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Gerencie os ônibus e vans da frota</p>
                </div>
                <Link href="/vehicles/new" className="inline-flex items-center gap-2 rounded-lg bg-[#0000FF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0000CC] transition-colors">
                    <PlusIcon className="h-4 w-4" /> Novo veículo
                </Link>
            </div>

            <DataTable data={data} columns={columns} loading={loading} searchColumn="licensePlate" searchPlaceholder="Buscar por placa…" pageSize={10} />
        </div>
    )
}
