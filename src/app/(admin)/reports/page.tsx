'use client'

import { useEffect, useState } from 'react'
import { BarChart3Icon, TrendingDownIcon, UsersIcon, ShieldAlertIcon, DownloadIcon } from 'lucide-react'
import { DataTable } from '@/components/data-table/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

interface MonthlySummary {
    totalTrips: number
    totalKm: number
    avgOccupancyRate: number
    underutilizedTrips: number
    estimatedFuelCost: number
    estimatedSavings: number
}

interface OccupationRow {
    tripId: string
    date: string
    routeName: string
    vehiclePlate: string
    scheduledCount: number
    checkedInCount: number
    occupancyRate: number
    capacity: number
}

interface FleetRow {
    vehicleId: string
    licensePlate: string
    model: string
    totalKm: number
    tripCount: number
}

const occColumns: ColumnDef<OccupationRow>[] = [
    { accessorKey: 'date', header: 'Data', cell: ({ getValue }) => format(new Date(getValue<string>()), 'dd/MM/yyyy') },
    { accessorKey: 'routeName', header: 'Rota' },
    { accessorKey: 'vehiclePlate', header: 'Veículo' },
    {
        accessorKey: 'occupancyRate',
        header: 'Taxa de Ocupação',
        cell: ({ row }) => {
            const rate = row.original.occupancyRate * 100
            const color = rate < 50 ? 'text-red-600 bg-red-50' : rate < 75 ? 'text-orange-600 bg-orange-50' : 'text-green-600 bg-green-50'
            return (
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${color}`}>
                        {rate.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-500">
                        ({row.original.checkedInCount}/{row.original.capacity})
                    </span>
                </div>
            )
        }
    }
]

const fleetColumns: ColumnDef<FleetRow>[] = [
    { accessorKey: 'licensePlate', header: 'Placa' },
    { accessorKey: 'model', header: 'Modelo' },
    { accessorKey: 'tripCount', header: 'Viagens no Período' },
    { accessorKey: 'totalKm', header: 'KM Rodado', cell: ({ getValue }) => <span className="font-mono">{getValue<number>().toLocaleString('pt-BR')} km</span> },
]


export default function ReportsPage() {
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState<MonthlySummary | null>(null)
    const [occupations, setOccupations] = useState<OccupationRow[]>([])
    const [fleet, setFleet] = useState<FleetRow[]>([])

    useEffect(() => {
        Promise.all([
            fetch('/api/v1/reports/monthly-summary').then(r => r.json()),
            fetch('/api/v1/reports/occupation').then(r => r.json()),
            fetch('/api/v1/reports/fleet-km').then(r => r.json())
        ]).then(([sData, oData, fData]) => {
            setSummary(sData)
            setOccupations(oData)
            setFleet(fData)
            setLoading(false)
        })
    }, [])

    if (loading) return <div className="flex justify-center py-20"><span className="animate-pulse">Gerando relatórios…</span></div>

    function KpiCard({ title, value, sub, icon: Icon, colorClass }: any) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{title}</h3>
                    <div className={`p-2 rounded-lg ${colorClass}`}><Icon className="h-5 w-5" /></div>
                </div>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-slate-800">{value}</p>
                </div>
                <p className="mt-2 text-xs font-medium text-slate-400">{sub}</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Relatórios e Inteligência</h2>
                <p className="text-sm text-slate-500 mt-0.5">Métricas de ocupação, custos e utilização da frota no mês atual.</p>
            </div>

            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard title="Ocupação Média" value={`${(summary.avgOccupancyRate * 100).toFixed(1)}%`} sub="Da capacidade total ofertada" icon={UsersIcon} colorClass="bg-blue-50 text-[#0000FF]" />
                    <KpiCard title="KM Rodado" value={`${summary.totalKm.toLocaleString('pt-BR')} km`} sub={`Em ${summary.totalTrips} viagens fechadas`} icon={BarChart3Icon} colorClass="bg-indigo-50 text-indigo-600" />
                    <KpiCard title="Viagens Subutilizadas" value={summary.underutilizedTrips} sub="Viagens com menos de 50% de ocupação" icon={ShieldAlertIcon} colorClass="bg-orange-50 text-orange-600" />
                    <KpiCard title="Economia Estimada" value={`R$ ${summary.estimatedSavings.toLocaleString('pt-BR')}`} sub="Comparado a fretamento padrão" icon={TrendingDownIcon} colorClass="bg-green-50 text-green-600" />
                </div>
            )}

            {/* Relatório de Ocupação */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Ocupação por Viagem</h3>
                        <p className="text-xs text-slate-500 mt-1">Identifique rotas que demandam veículos menores ou ajustes de horário.</p>
                    </div>
                    <button className="flex items-center gap-2 text-[#0000FF] font-semibold text-sm hover:underline">
                        <DownloadIcon className="h-4 w-4" /> Exportar CSV
                    </button>
                </div>
                <div className="p-6">
                    <DataTable data={occupations} columns={occColumns} searchColumn="routeName" searchPlaceholder="Filtrar por rota…" pageSize={5} />
                </div>
            </div>

            {/* Relatório de Frota */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Utilização da Frota</h3>
                    <p className="text-xs text-slate-500 mt-1">Quilometragem acumulada por veículo no período selecionado.</p>
                </div>
                <div className="p-6">
                    <DataTable data={fleet} columns={fleetColumns} searchColumn="licensePlate" searchPlaceholder="Buscar placa…" pageSize={5} />
                </div>
            </div>

        </div>
    )
}
