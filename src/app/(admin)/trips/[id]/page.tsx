'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, SearchIcon, CheckIcon, FingerprintIcon, UsersIcon, FlagIcon } from 'lucide-react'
import { format } from 'date-fns'

interface Passenger {
    student: { id: string; name: string; cpf: string; boardingPointId: string }
    checkedIn: boolean
    checkinMethod: string | null
    checkinAt: string | null
}

interface Trip {
    id: string
    operationDayId: string
    route: { id: string; name: string; direction: string }
    vehicle: { licensePlate: string; capacity: number }
    driver: { name: string }
    status: string
    departureTime: string
    scheduledCount: number
    checkedInCount: number
    passengers: Passenger[]
}

export default function TripBoardingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [trip, setTrip] = useState<Trip | null>(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        fetchTrip()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    async function fetchTrip() {
        try {
            const res = await fetch(`/api/v1/trips/${id}`)
            if (!res.ok) throw new Error()
            setTrip(await res.json())
        } catch {
            router.replace('/operation-days')
        } finally {
            setLoading(false)
        }
    }

    async function handleCheckin(studentId: string, method: 'manual' | 'biometric' = 'manual') {
        setActionLoading(studentId)
        const res = await fetch(`/api/v1/trips/${id}/attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, method, biometricConfidence: method === 'biometric' ? 0.95 : undefined }),
        })

        if (res.ok) {
            await fetchTrip()
        } else {
            const e = await res.json()
            alert(e.message || 'Erro ao registrar presença')
        }
        setActionLoading(null)
    }

    async function handleUndoCheckin(studentId: string) {
        setActionLoading(studentId)
        const res = await fetch(`/api/v1/trips/${id}/attendance/${studentId}`, { method: 'DELETE' })
        if (res.ok) await fetchTrip()
        setActionLoading(null)
    }

    if (loading) return <div className="flex justify-center py-20"><span className="animate-pulse">Carregando lista de embarque…</span></div>
    if (!trip) return null

    const filteredPassengers = trip.passengers?.filter(p =>
        p.student.name.toLowerCase().includes(search.toLowerCase()) ||
        p.student.cpf.includes(search.replace(/\D/g, ''))
    ) || []

    const occupancyRate = trip.scheduledCount > 0 ? (trip.checkedInCount / trip.vehicle.capacity) * 100 : 0
    const isClosed = trip.status === 'closed'

    return (
        <div className="max-w-3xl space-y-6 pb-20">
            <div className="bg-[#0000FF] -mx-4 -mt-6 p-6 sm:mx-0 sm:mt-0 sm:rounded-xl text-white shadow-md">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={`/operation-days/${trip.operationDayId}`} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">{trip.route.name}</h1>
                            <p className="text-blue-100 text-sm mt-0.5">{format(new Date(trip.departureTime), 'HH:mm')} · {trip.vehicle.licensePlate} ({trip.driver.name})</p>
                        </div>
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded ${trip.route.direction === 'going' ? 'bg-blue-200 text-[#0000FF]' : 'bg-orange-200 text-orange-900'}`}>
                        {trip.route.direction === 'going' ? 'IDA' : 'VOLTA'}
                    </span>
                </div>

                <div className="mt-6 bg-white/10 rounded-lg p-4 flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider">Ocupação Atual</p>
                        <p className="text-3xl font-black">{trip.checkedInCount} <span className="text-base font-medium text-blue-200">/ {trip.vehicle.capacity} vagas</span></p>
                    </div>
                    <div className="text-right">
                        <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider">Status</p>
                        <p className="text-lg font-bold">
                            {isClosed ? 'Viagem Fechada' : trip.status === 'active' ? 'Em Andamento' : 'Planejada'}
                        </p>
                    </div>
                </div>
                {occupancyRate > 90 && (
                    <div className="mt-3 text-xs bg-red-500/80 text-white px-3 py-1.5 rounded flex items-center gap-2">
                        <UsersIcon className="h-3 w-3" /> Atenção: Lotação próxima da capacidade máxima
                    </div>
                )}
            </div>

            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar aluno por nome ou CPF..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0000FF]/20 focus:border-[#0000FF] transition-colors"
                />
            </div>

            <div className="space-y-3">
                {filteredPassengers.length === 0 ? (
                    <p className="text-center text-slate-500 py-10">Nenhum estudante encontrado.</p>
                ) : (
                    filteredPassengers.map((p) => (
                        <div key={p.student.id} className={`bg-white rounded-xl border p-4 flex items-center justify-between gap-4 transition-all ${p.checkedIn ? 'border-green-300 shadow-sm bg-green-50/30' : 'border-slate-200'}`}>
                            <div>
                                <h3 className="font-bold text-slate-800">{p.student.name}</h3>
                                <p className="text-xs text-slate-500 font-mono mt-0.5">{p.student.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</p>
                                {p.checkedIn && (
                                    <p className="text-[10px] text-green-700 font-bold mt-1.5 uppercase tracking-wide flex items-center gap-1">
                                        <CheckIcon className="h-3 w-3" />
                                        Presente ({p.checkinMethod === 'biometric' ? 'Biometria' : 'Manual'}) às {format(new Date(p.checkinAt!), 'HH:mm')}
                                    </p>
                                )}
                            </div>

                            {!isClosed && (
                                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                                    {p.checkedIn ? (
                                        <button
                                            onClick={() => handleUndoCheckin(p.student.id)}
                                            disabled={actionLoading === p.student.id}
                                            className="text-xs text-slate-400 hover:text-red-500 underline disabled:opacity-50"
                                        >
                                            {actionLoading === p.student.id ? 'Desfazendo…' : 'Desfazer'}
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleCheckin(p.student.id, 'manual')}
                                                disabled={actionLoading === p.student.id}
                                                className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-50"
                                            >
                                                {actionLoading === p.student.id ? '...' : 'Manual'}
                                            </button>
                                            <button
                                                onClick={() => handleCheckin(p.student.id, 'biometric')}
                                                disabled={actionLoading === p.student.id}
                                                className="rounded-lg bg-[#0000FF] hover:bg-[#0000CC] text-white px-3 py-2 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                                            >
                                                <FingerprintIcon className="h-3.5 w-3.5" />
                                                Ler Rosto
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {!isClosed && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 md:relative md:bg-transparent md:border-none md:p-0 md:pt-4 flex justify-end">
                    <Link href={`/trips/${trip.id}/close`} className="w-full md:w-auto rounded-lg bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-colors">
                        <FlagIcon className="h-4 w-4" />
                        Encerrar Viagem (Chegada)
                    </Link>
                </div>
            )}
        </div>
    )
}
