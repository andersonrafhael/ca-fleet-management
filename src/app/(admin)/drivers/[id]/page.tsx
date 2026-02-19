'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, AlertTriangleIcon, Trash2Icon } from 'lucide-react'
import { DriverForm } from '@/components/forms/DriverForm'
import type { DriverFormValues } from '@/lib/schemas/support'

interface Driver { id: string; name: string; cpf: string; cnh: string; cnhCategory: string; phone?: string; status: string }

const STATUS_LABELS: Record<string, string> = { active: 'Ativo', vacation: 'Férias/Licença', inactive: 'Inativo' }
const STATUS_COLORS: Record<string, string> = { active: 'bg-green-100 text-green-700', vacation: 'bg-blue-100 text-blue-700', inactive: 'bg-slate-100 text-slate-600' }

export default function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [data, setData] = useState<Driver | null>(null)
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState(false)

    useEffect(() => {
        fetch(`/api/v1/drivers/${id}`)
            .then(r => { if (!r.ok) throw new Error(); return r.json() })
            .then(d => { setData(d); setLoading(false) })
            .catch(() => router.replace('/drivers'))
    }, [id, router])

    async function handleUpdate(values: DriverFormValues) {
        const res = await fetch(`/api/v1/drivers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...values, cpf: values.cpf.replace(/\D/g, '') }),
        })
        if (res.ok) {
            setData(await res.json())
            setEditMode(false)
        }
    }

    async function handleDelete() {
        await fetch(`/api/v1/drivers/${id}`, { method: 'DELETE' })
        router.push('/drivers')
    }

    if (loading) return <div className="flex justify-center py-20"><span className="animate-pulse">Carregando…</span></div>
    if (!data) return null

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/drivers" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors">
                        <ArrowLeftIcon className="h-4 w-4" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{data.name}</h2>
                        <div className="mt-1 flex items-center gap-2">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[data.status]}`}>
                                {STATUS_LABELS[data.status] || data.status}
                            </span>
                            <span className="text-xs font-mono text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">CAT {data.cnhCategory}</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => setDeleteConfirm(true)} className="rounded-lg p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2Icon className="h-4 w-4" />
                </button>
            </div>

            {deleteConfirm && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                    <AlertTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-red-700">Desativar motorista?</p>
                        <p className="text-xs text-red-500 mt-0.5">O motorista será marcado como inativo e não poderá ser escalado.</p>
                        <div className="flex gap-2 mt-3">
                            <button onClick={handleDelete} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">Confirmar</button>
                            <button onClick={() => setDeleteConfirm(false)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-white">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                {editMode ? (
                    <DriverForm
                        defaultValues={{ name: data.name, cpf: data.cpf, cnh: data.cnh, cnhCategory: data.cnhCategory as any, phone: data.phone, status: data.status as any }}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditMode(false)}
                        isEdit
                    />
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                            <div className="col-span-2 sm:col-span-1">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">CPF</p>
                                <p className="mt-0.5 text-slate-800">{data.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</p>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">CNH</p>
                                <p className="mt-0.5 text-slate-800">{data.cnh}</p>
                            </div>
                            <div className="col-span-2 sm:col-span-2">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Telefone</p>
                                <p className="mt-0.5 text-slate-800">{data.phone || '—'}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <button onClick={() => setEditMode(true)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                Editar dados
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
