'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, AlertTriangleIcon, Trash2Icon } from 'lucide-react'
import { VehicleForm } from '@/components/forms/VehicleForm'
import { VEHICLE_TYPES } from '@/lib/schemas/support'
import type { VehicleFormValues } from '@/lib/schemas/support'

interface Vehicle { id: string; licensePlate: string; brand: string; model: string; capacity: number; year: number; currentKm: number; type: string; status: string }

const STATUS_LABELS: Record<string, string> = { active: 'Ativo', maintenance: 'Manutenção', inactive: 'Inativo' }
const STATUS_COLORS: Record<string, string> = { active: 'bg-green-100 text-green-700', maintenance: 'bg-orange-100 text-orange-700', inactive: 'bg-slate-100 text-slate-600' }

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [data, setData] = useState<Vehicle | null>(null)
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState(false)

    useEffect(() => {
        fetch(`/api/v1/vehicles/${id}`)
            .then(r => { if (!r.ok) throw new Error(); return r.json() })
            .then(d => { setData(d); setLoading(false) })
            .catch(() => router.replace('/vehicles'))
    }, [id, router])

    async function handleUpdate(values: VehicleFormValues) {
        const res = await fetch(`/api/v1/vehicles/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        })
        if (res.ok) {
            setData(await res.json())
            setEditMode(false)
        }
    }

    async function handleDelete() {
        await fetch(`/api/v1/vehicles/${id}`, { method: 'DELETE' })
        router.push('/vehicles')
    }

    if (loading) return <div className="flex justify-center py-20"><span className="animate-pulse">Carregando…</span></div>
    if (!data) return null

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/vehicles" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors">
                        <ArrowLeftIcon className="h-4 w-4" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">{data.licensePlate}</h2>
                        <div className="mt-1 flex items-center gap-2">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[data.status]}`}>
                                {STATUS_LABELS[data.status] || data.status}
                            </span>
                            <span className="text-sm text-slate-500">{data.brand} {data.model}</span>
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
                        <p className="text-sm font-medium text-red-700">Desativar veículo?</p>
                        <p className="text-xs text-red-500 mt-0.5">O veículo será marcado como inativo e não poderá ser alocado em operações.</p>
                        <div className="flex gap-2 mt-3">
                            <button onClick={handleDelete} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">Confirmar</button>
                            <button onClick={() => setDeleteConfirm(false)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-white">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                {editMode ? (
                    <VehicleForm
                        defaultValues={{ licensePlate: data.licensePlate, brand: data.brand, model: data.model, year: data.year, capacity: data.capacity, type: data.type as any, status: data.status as any, currentKm: data.currentKm }}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditMode(false)}
                        isEdit
                    />
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Placa</p>
                                <p className="mt-0.5 text-slate-800 uppercase">{data.licensePlate}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tipo</p>
                                <p className="mt-0.5 text-slate-800">{VEHICLE_TYPES[data.type] || data.type}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ano</p>
                                <p className="mt-0.5 text-slate-800">{data.year}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Capacidade</p>
                                <p className="mt-0.5 text-slate-800">{data.capacity} lugares</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">KM Atual</p>
                                <p className="mt-0.5 text-slate-800">{data.currentKm?.toLocaleString('pt-BR')} km</p>
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
