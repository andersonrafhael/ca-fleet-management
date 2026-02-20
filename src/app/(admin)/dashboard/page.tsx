import type { Metadata } from 'next'
import Link from 'next/link'
import {
    BusIcon,
    UsersIcon,
    BarChart3Icon,
    AlertTriangleIcon,
    PlusIcon,
    CalendarPlusIcon,
    FileBarChartIcon,
    ScrollTextIcon,
    ArrowRightIcon,
    CheckCircle2Icon,
    ClockIcon,
    MapPinIcon,
    ShieldCheckIcon,
    ShieldAlertIcon,
    WrenchIcon,
    CirclePauseIcon,
    TrendingUpIcon,
    FingerprintIcon,
    FuelIcon,
    CircleAlertIcon,
    CircleCheckIcon,
    ActivityIcon,
    PlayIcon,
} from 'lucide-react'

export const metadata: Metadata = {
    title: 'Painel',
}

/* ═══════════════════════════════════════════════════════════════════
   MOCK DATA — will come from API in production
   ═══════════════════════════════════════════════════════════════════ */

const KPI = [
    {
        label: 'Viagens Hoje',
        value: '8',
        sub: '5 concluídas · 2 em rota · 1 planejada',
        icon: BusIcon,
        iconBg: 'bg-[#0000FF]/10',
        iconColor: 'text-[#0000FF]',
        trend: '+2 vs ontem',
        trendUp: true,
    },
    {
        label: 'Capacidade × Presença',
        value: '78%',
        sub: '312 assentos · 243 presenças',
        icon: UsersIcon,
        iconBg: 'bg-[#00AA44]/10',
        iconColor: 'text-[#00AA44]',
        trend: '+5% semana',
        trendUp: true,
    },
    {
        label: 'Check-in Biometria',
        value: '89%',
        sub: '216 bio · 21 manual · 6 pendente',
        icon: FingerprintIcon,
        iconBg: 'bg-[#0099DD]/10',
        iconColor: 'text-[#0099DD]',
        trend: '+3% vs ontem',
        trendUp: true,
    },
    {
        label: 'Exceções Críticas',
        value: '3',
        sub: '1 sem motorista · 2 baixa ocupação',
        icon: AlertTriangleIcon,
        iconBg: 'bg-[#DD1111]/10',
        iconColor: 'text-[#DD1111]',
        trend: '-1 vs ontem',
        trendUp: false,
        warn: true,
    },
    {
        label: 'Economia Estimada',
        value: 'R$ 2.840',
        sub: 'vs mês anterior · otimização de rotas',
        icon: TrendingUpIcon,
        iconBg: 'bg-[#00AA44]/10',
        iconColor: 'text-[#00AA44]',
        trend: '+12% mês',
        trendUp: true,
    },
]

/* ─── Trips timeline ────────────────────────────────────────────── */
const TRIPS = [
    { id: '1', route: 'Campo Alegre → UFAL', dir: 'IDA', time: '06:00', status: 'completed' as const, occupancy: 92, checkinBio: 95, vehicle: 'Ônibus 01', driver: 'José Silva' },
    { id: '2', route: 'Campo Alegre → CESMAC', dir: 'IDA', time: '06:30', status: 'completed' as const, occupancy: 85, checkinBio: 88, vehicle: 'Ônibus 02', driver: 'Carlos Lima' },
    { id: '3', route: 'Campo Alegre → Estácio', dir: 'IDA', time: '06:45', status: 'completed' as const, occupancy: 68, checkinBio: 82, vehicle: 'Van 01', driver: 'Roberto Santos' },
    { id: '4', route: 'Campo Alegre → UFAL', dir: 'IDA', time: '07:00', status: 'completed' as const, occupancy: 45, checkinBio: 90, vehicle: 'Van 02', driver: 'André Costa', warn: true },
    { id: '5', route: 'Campo Alegre → CESMAC', dir: 'IDA', time: '07:30', status: 'completed' as const, occupancy: 76, checkinBio: 91, vehicle: 'Ônibus 03', driver: 'Paulo Mendes' },
    { id: '6', route: 'UFAL → Campo Alegre', dir: 'VOLTA', time: '12:00', status: 'active' as const, occupancy: 61, checkinBio: 78, vehicle: 'Ônibus 01', driver: 'José Silva' },
    { id: '7', route: 'CESMAC → Campo Alegre', dir: 'VOLTA', time: '12:30', status: 'active' as const, occupancy: 0, checkinBio: 0, vehicle: 'Ônibus 02', driver: 'Carlos Lima' },
    { id: '8', route: 'UFAL → Campo Alegre', dir: 'VOLTA', time: '18:00', status: 'planned' as const, occupancy: 0, checkinBio: 0, vehicle: 'Van 01', driver: '' },
]

const STATUS_CONFIG = {
    completed: { label: 'Concluída', icon: CheckCircle2Icon, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    active: { label: 'Em rota', icon: PlayIcon, color: 'text-[#0000FF] bg-[#0000FF]/5 border-[#0000FF]/20' },
    planned: { label: 'Planejada', icon: ClockIcon, color: 'text-slate-500 bg-slate-50 border-slate-200' },
    delayed: { label: 'Atrasada', icon: AlertTriangleIcon, color: 'text-red-700 bg-red-50 border-red-200' },
    boarding: { label: 'Embarque', icon: UsersIcon, color: 'text-amber-700 bg-amber-50 border-amber-200' },
}

/* ─── Heatmap data ──────────────────────────────────────────────── */
const HEATMAP_ROUTES = ['UFAL (IDA)', 'CESMAC (IDA)', 'Estácio (IDA)', 'UFAL (VOLTA)', 'CESMAC (VOLTA)', 'Estácio (VOLTA)']
const HEATMAP_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
const HEATMAP_DATA = [
    [92, 88, 90, 85, 78],
    [85, 82, 79, 88, 84],
    [68, 65, 72, 70, 55],
    [78, 80, 75, 82, 71],
    [72, 68, 74, 70, 65],
    [45, 42, 48, 50, 38],
]

/* ─── Fleet data ────────────────────────────────────────────────── */
const FLEET = [
    { status: 'available', label: 'Disponível', count: 3, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CircleCheckIcon },
    { status: 'in_use', label: 'Em uso', count: 4, color: 'text-[#0000FF]', bg: 'bg-[#0000FF]/5', border: 'border-[#0000FF]/20', icon: BusIcon },
    { status: 'maintenance', label: 'Manutenção', count: 1, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: WrenchIcon },
    { status: 'unavailable', label: 'Indisponível', count: 0, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200', icon: CirclePauseIcon },
]

/* ─── Exceptions ────────────────────────────────────────────────── */
const EXCEPTIONS = [
    { severity: 'critical', message: 'Viagem 18:00 UFAL sem motorista alocado', action: 'Alocar motorista', href: '/trips/8' },
    { severity: 'warning', message: 'Rota Estácio (VOLTA) com 38% ocupação sexta', action: 'Ver rota', href: '/routes' },
    { severity: 'warning', message: 'Rota Estácio (IDA) com baixa ocupação recorrente', action: 'Otimizar', href: '/routes' },
]

/* ─── Smart actions ─────────────────────────────────────────────── */
const ACTIONS = [
    { label: 'Criar Operação do Dia', href: '/operation-days', icon: CalendarPlusIcon, highlight: true },
    { label: 'Resolver Pendências', href: '/operation-days', icon: CircleAlertIcon, badge: '3' },
    { label: 'Cadastrar Biometria', href: '/students', icon: FingerprintIcon, badge: '6' },
    { label: 'Novo Estudante', href: '/students/new', icon: PlusIcon },
    { label: 'Relatório do Dia', href: '/reports', icon: FileBarChartIcon },
    { label: 'Logs de Auditoria', href: '/audit-logs', icon: ScrollTextIcon },
]

/* ─── Greeting ──────────────────────────────────────────────────── */
function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return 'Bom dia'
    if (h < 18) return 'Boa tarde'
    return 'Boa noite'
}

function getOccupancyColor(val: number) {
    if (val >= 80) return 'bg-emerald-500'
    if (val >= 60) return 'bg-amber-400'
    if (val >= 40) return 'bg-orange-400'
    if (val > 0) return 'bg-red-400'
    return 'bg-slate-200'
}

function getOccupancyTextColor(val: number) {
    if (val >= 80) return 'text-white'
    if (val >= 60) return 'text-white'
    if (val >= 40) return 'text-white'
    if (val > 0) return 'text-white'
    return 'text-slate-400'
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
    const today = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })

    return (
        <div className="space-y-5">
            {/* ─── Header ──────────────────────────────────── */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        {getGreeting()}, Admin
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Prefeitura de Campo Alegre · {today}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0000FF]/5 text-[#0000FF] text-xs font-semibold border border-[#0000FF]/10">
                        <ActivityIcon className="h-3 w-3" />
                        Operação Ativa
                    </span>
                </div>
            </div>

            {/* ─── KPI Cards ───────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {KPI.map((kpi, i) => (
                    <div
                        key={kpi.label}
                        className="group bg-white rounded-xl border border-slate-200/80 p-4 flex flex-col gap-3
                         shadow-[0_1px_3px_0_rgb(0_0_0/0.04)] hover:shadow-[0_4px_12px_-2px_rgb(0_0_0/0.08)]
                         transition-all duration-200 cursor-pointer"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${kpi.iconBg}`}>
                                <kpi.icon className={`h-[18px] w-[18px] ${kpi.iconColor}`} />
                            </div>
                            {kpi.trend && (
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${kpi.trendUp ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                                    {kpi.trend}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-800 tracking-tight">{kpi.value}</p>
                            <p className="text-xs font-medium text-slate-600 mt-0.5">{kpi.label}</p>
                            <p className={`text-[11px] mt-0.5 ${kpi.warn ? 'text-amber-600 font-medium' : 'text-slate-400'}`}>
                                {kpi.sub}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ─── Row: Operação do Dia + Exceções ─────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Operação do Dia — Agenda/Timeline */}
                <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_0_rgb(0_0_0/0.04)] overflow-hidden">
                    <div className="flex items-center justify-between p-4 pb-3 border-b border-slate-100">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Operação do Dia</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">8 viagens · 5 concluídas · 2 em rota · 1 planejada</p>
                        </div>
                        <Link href="/operation-days" className="text-xs font-medium text-[#0000FF] hover:text-[#0000CC] flex items-center gap-1 transition-colors">
                            Ver tudo <ArrowRightIcon className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                                    <th className="text-left px-4 py-2.5 w-10">Hora</th>
                                    <th className="text-left px-3 py-2.5">Rota</th>
                                    <th className="text-left px-3 py-2.5 hidden md:table-cell">Veículo</th>
                                    <th className="text-left px-3 py-2.5 hidden lg:table-cell">Motorista</th>
                                    <th className="text-center px-3 py-2.5">Ocup.</th>
                                    <th className="text-center px-3 py-2.5 hidden sm:table-cell">Bio</th>
                                    <th className="text-left px-3 py-2.5">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TRIPS.map((trip) => {
                                    const cfg = STATUS_CONFIG[trip.status]
                                    return (
                                        <tr key={trip.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-2.5 text-xs font-mono text-slate-500">{trip.time}</td>
                                            <td className="px-3 py-2.5">
                                                <Link href={`/trips/${trip.id}`} className="text-sm font-medium text-slate-700 hover:text-[#0000FF] transition-colors">
                                                    {trip.route}
                                                </Link>
                                                <span className="ml-1.5 text-[10px] text-slate-400 font-normal">({trip.dir})</span>
                                            </td>
                                            <td className="px-3 py-2.5 text-xs text-slate-500 hidden md:table-cell">{trip.vehicle}</td>
                                            <td className="px-3 py-2.5 text-xs text-slate-500 hidden lg:table-cell">
                                                {trip.driver || <span className="text-red-500 font-medium">⚠ Sem alocação</span>}
                                            </td>
                                            <td className="px-3 py-2.5 text-center">
                                                {trip.occupancy > 0 ? (
                                                    <span className={`text-xs font-bold ${trip.occupancy < 50 ? 'text-red-500' : trip.occupancy < 70 ? 'text-amber-500' : 'text-emerald-600'}`}>
                                                        {trip.occupancy}%
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-300">—</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2.5 text-center hidden sm:table-cell">
                                                {trip.checkinBio > 0 ? (
                                                    <span className={`text-xs ${trip.checkinBio >= 85 ? 'text-emerald-600' : 'text-amber-500'}`}>
                                                        {trip.checkinBio}%
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-300">—</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full border ${cfg.color}`}>
                                                    <cfg.icon className="h-3 w-3" />
                                                    {cfg.label}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Exceções Críticas + Smart Actions */}
                <div className="space-y-4">
                    {/* Exceptions */}
                    <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_0_rgb(0_0_0/0.04)] overflow-hidden">
                        <div className="flex items-center justify-between p-4 pb-3 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                                    {EXCEPTIONS.length}
                                </span>
                                Exceções
                            </h3>
                        </div>
                        <div className="p-3 space-y-2">
                            {EXCEPTIONS.map((exc, i) => (
                                <div
                                    key={i}
                                    className={`flex items-start gap-2.5 rounded-lg p-2.5 border ${exc.severity === 'critical'
                                            ? 'bg-red-50/50 border-red-200/80'
                                            : 'bg-amber-50/50 border-amber-200/80'
                                        }`}
                                >
                                    {exc.severity === 'critical' ? (
                                        <ShieldAlertIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    ) : (
                                        <AlertTriangleIcon className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-700 leading-relaxed">{exc.message}</p>
                                        <Link href={exc.href} className="text-[11px] font-semibold text-[#0000FF] hover:underline mt-1 inline-block">
                                            {exc.action} →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Smart Actions */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                        <h3 className="text-sm font-bold text-slate-800 mb-3">Ações Rápidas</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {ACTIONS.map((action) => (
                                <Link
                                    key={action.href + action.label}
                                    href={action.href}
                                    className={`group/a relative flex items-center gap-2 rounded-xl border px-3 py-2.5
                                     text-xs font-medium transition-all duration-200 cursor-pointer
                                     ${action.highlight
                                            ? 'bg-[#0000FF] text-white border-[#0000FF] hover:bg-[#0000DD] shadow-sm shadow-blue-500/15'
                                            : 'bg-slate-50/50 text-slate-700 border-slate-200 hover:bg-[#0000FF] hover:text-white hover:border-[#0000FF] hover:shadow-sm hover:shadow-blue-500/15'
                                        }`}
                                >
                                    <action.icon className={`h-3.5 w-3.5 flex-shrink-0 ${action.highlight ? 'text-white/80' : 'text-slate-400 group-hover/a:text-white/80'} transition-colors`} />
                                    <span className="truncate">{action.label}</span>
                                    {action.badge && (
                                        <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold
                                         ${action.highlight ? 'bg-white text-[#0000FF]' : 'bg-amber-500 text-white'}`}>
                                            {action.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Row: Heatmap + Fleet + Biometrics ────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Heatmap de Ocupação */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_0_rgb(0_0_0/0.04)] overflow-hidden">
                    <div className="flex items-center justify-between p-4 pb-3 border-b border-slate-100">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Heatmap de Ocupação</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">Ocupação média por rota × dia da semana</p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-400" /> &lt;50%</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-orange-400" /> 50-59%</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> 60-79%</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> ≥80%</span>
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-left text-[11px] font-medium text-slate-400 pb-2 pr-3 min-w-[140px]">Rota</th>
                                    {HEATMAP_DAYS.map((day) => (
                                        <th key={day} className="text-center text-[11px] font-medium text-slate-400 pb-2 px-1 w-16">{day}</th>
                                    ))}
                                    <th className="text-center text-[11px] font-medium text-slate-400 pb-2 px-1 w-16">Média</th>
                                </tr>
                            </thead>
                            <tbody>
                                {HEATMAP_ROUTES.map((route, ri) => {
                                    const avg = Math.round(HEATMAP_DATA[ri].reduce((a, b) => a + b, 0) / HEATMAP_DATA[ri].length)
                                    return (
                                        <tr key={route}>
                                            <td className="text-xs font-medium text-slate-600 py-1 pr-3">{route}</td>
                                            {HEATMAP_DATA[ri].map((val, ci) => (
                                                <td key={ci} className="px-1 py-1 text-center">
                                                    <div className={`rounded-lg py-1.5 text-[11px] font-bold ${getOccupancyColor(val)} ${getOccupancyTextColor(val)} cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-slate-300 transition-all`}>
                                                        {val}%
                                                    </div>
                                                </td>
                                            ))}
                                            <td className="px-1 py-1 text-center">
                                                <span className={`text-[11px] font-bold ${avg >= 80 ? 'text-emerald-600' : avg >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                                                    {avg}%
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Fleet status + Biometrics quality */}
                <div className="space-y-4">
                    {/* Fleet */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-800">Frota</h3>
                            <Link href="/vehicles" className="text-[11px] font-medium text-[#0000FF] hover:text-[#0000CC] transition-colors">
                                Ver todos →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {FLEET.map((f) => (
                                <div key={f.status} className={`flex items-center gap-2.5 rounded-xl border ${f.border} ${f.bg} px-3 py-2.5`}>
                                    <f.icon className={`h-4 w-4 ${f.color}`} />
                                    <div>
                                        <p className="text-lg font-bold text-slate-800 leading-none">{f.count}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{f.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100">
                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                <WrenchIcon className="h-3 w-3" />
                                Ônibus 04: Manutenção prev. 25/02
                            </p>
                        </div>
                    </div>

                    {/* Biometrics Quality */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                        <h3 className="text-sm font-bold text-slate-800 mb-3">Qualidade do Check-in</h3>
                        <div className="space-y-3">
                            {/* Biometric bar */}
                            <div>
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="text-slate-600 font-medium flex items-center gap-1">
                                        <FingerprintIcon className="h-3 w-3 text-[#0099DD]" /> Biométrico
                                    </span>
                                    <span className="font-bold text-slate-700">89%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#0099DD] to-[#0000FF] rounded-full transition-all duration-500" style={{ width: '89%' }} />
                                </div>
                            </div>
                            {/* Manual bar */}
                            <div>
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="text-slate-600 font-medium flex items-center gap-1">
                                        <ShieldCheckIcon className="h-3 w-3 text-amber-500" /> Manual (fallback)
                                    </span>
                                    <span className="font-bold text-slate-700">9%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: '9%' }} />
                                </div>
                            </div>
                            {/* Pending bar */}
                            <div>
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="text-slate-600 font-medium flex items-center gap-1">
                                        <ClockIcon className="h-3 w-3 text-slate-400" /> Pendente
                                    </span>
                                    <span className="font-bold text-slate-700">2%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-300 rounded-full transition-all duration-500" style={{ width: '2%' }} />
                                </div>
                            </div>
                        </div>
                        <Link href="/reports" className="mt-3 pt-3 border-t border-slate-100 text-[11px] font-medium text-[#0000FF] hover:underline flex items-center gap-1">
                            Ver relatório completo <ArrowRightIcon className="h-3 w-3" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
