'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PlusIcon, ShieldCheckIcon, ShieldXIcon } from 'lucide-react'
import { DataTable } from '@/components/data-table/DataTable'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/schemas/student'
import type { ColumnDef } from '@tanstack/react-table'

interface Student {
    id: string
    name: string
    cpf: string
    course?: string
    status: string
    institution?: { name: string }
    boardingPoint?: { name: string }
    hasBiometric: boolean
}

interface ApiResponse {
    data: Student[]
    total: number
}

const columns: ColumnDef<Student>[] = [
    {
        accessorKey: 'name',
        header: 'Nome',
        cell: ({ row }) => (
            <Link href={`/students/${row.original.id}`} className="font-medium text-[#0000FF] hover:underline">
                {row.original.name}
            </Link>
        ),
    },
    {
        accessorKey: 'cpf',
        header: 'CPF',
        cell: ({ getValue }) => {
            const v = getValue<string>()
            return v ? `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}` : '—'
        },
    },
    {
        accessorKey: 'course',
        header: 'Curso',
        cell: ({ getValue }) => getValue<string>() || '—',
    },
    {
        id: 'institution',
        header: 'Instituição',
        accessorFn: (row) => row.institution?.name ?? '—',
    },
    {
        id: 'boardingPoint',
        header: 'Embarque',
        accessorFn: (row) => row.boardingPoint?.name ?? '—',
    },
    {
        accessorKey: 'hasBiometric',
        header: 'Biometria',
        enableSorting: false,
        cell: ({ getValue }) =>
            getValue<boolean>() ? (
                <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                    <ShieldCheckIcon className="h-3.5 w-3.5" /> Cadastrada
                </span>
            ) : (
                <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                    <ShieldXIcon className="h-3.5 w-3.5" /> Pendente
                </span>
            ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
            const v = getValue<string>()
            return (
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[v]}`}>
                    {STATUS_LABELS[v] ?? v}
                </span>
            )
        },
    },
    {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
            <Link
                href={`/students/${row.original.id}`}
                className="text-xs text-slate-500 hover:text-[#0000FF] transition-colors"
            >
                Ver →
            </Link>
        ),
    },
]

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('')

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const qs = statusFilter ? `&status=${statusFilter}` : ''
                const res = await fetch(`/api/v1/students?limit=100${qs}`)
                const json: ApiResponse = await res.json()
                setStudents(json.data)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [statusFilter])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Alunos</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                        {loading ? '…' : `${students.length} aluno${students.length !== 1 ? 's' : ''} cadastrado${students.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <Link
                    href="/students/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0000FF] px-4 py-2 text-sm font-semibold text-white
                     hover:bg-[#0000CC] transition-colors"
                >
                    <PlusIcon className="h-4 w-4" />
                    Novo aluno
                </Link>
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-2 flex-wrap">
                {['', 'active', 'inactive', 'suspended'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium border transition-colors ${statusFilter === s
                                ? 'bg-[#0000FF] text-white border-[#0000FF]'
                                : 'border-slate-200 text-slate-600 hover:border-slate-400'
                            }`}
                    >
                        {s === '' ? 'Todos' : STATUS_LABELS[s]}
                    </button>
                ))}
            </div>

            <DataTable
                data={students}
                columns={columns}
                loading={loading}
                searchColumn="name"
                searchPlaceholder="Buscar por nome…"
                pageSize={15}
            />
        </div>
    )
}
