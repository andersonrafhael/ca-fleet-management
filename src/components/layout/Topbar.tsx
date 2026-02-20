'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { BellIcon, SearchIcon, UserCircleIcon, ChevronRightIcon } from 'lucide-react'
import { useMemo } from 'react'

interface TopbarProps {
    userName?: string
    userRole?: string
}

const ROLE_LABELS: Record<string, string> = {
    admin: 'Administrador',
    operator: 'Operador',
    driver: 'Motorista',
}

/* ─── Breadcrumb map ────────────────────────────────────────────── */
const PAGE_LABELS: Record<string, string> = {
    dashboard: 'Painel',
    students: 'Alunos',
    institutions: 'Instituições',
    'boarding-points': 'Pontos de Embarque',
    routes: 'Rotas',
    vehicles: 'Veículos',
    drivers: 'Motoristas',
    'operation-days': 'Dias de Operação',
    reports: 'Relatórios',
    'audit-logs': 'Logs de Auditoria',
    trips: 'Viagens',
    new: 'Novo',
    close: 'Encerrar',
}

function useBreadcrumbs() {
    const pathname = usePathname()
    return useMemo(() => {
        const segments = pathname.split('/').filter(Boolean)
        return segments.map((seg, i) => {
            const href = '/' + segments.slice(0, i + 1).join('/')
            const isUuid = /^[0-9a-f-]{8,}$/i.test(seg)
            const label = isUuid ? 'Detalhes' : (PAGE_LABELS[seg] ?? seg)
            const isLast = i === segments.length - 1
            return { label, href, isLast }
        })
    }, [pathname])
}

export function Topbar({ userName = 'Usuário', userRole = 'admin' }: TopbarProps) {
    const breadcrumbs = useBreadcrumbs()
    const pageTitle = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : ''

    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-sm px-6 flex-shrink-0 z-10">
            {/* Left: Breadcrumbs + Title */}
            <div className="min-w-0 flex-1">
                {/* Breadcrumbs */}
                {breadcrumbs.length > 1 && (
                    <nav aria-label="Breadcrumb" className="mb-0.5">
                        <ol className="flex items-center gap-1 text-xs text-slate-400">
                            {breadcrumbs.map((crumb, i) => (
                                <li key={crumb.href} className="flex items-center gap-1">
                                    {i > 0 && <ChevronRightIcon className="h-3 w-3 text-slate-300" />}
                                    {crumb.isLast ? (
                                        <span className="font-medium text-slate-600">{crumb.label}</span>
                                    ) : (
                                        <Link
                                            href={crumb.href}
                                            className="hover:text-[#0000FF] transition-colors"
                                        >
                                            {crumb.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}
                <h1 className="text-lg font-bold text-slate-800 truncate leading-tight">
                    {pageTitle}
                </h1>
            </div>

            {/* Right: Search + Actions + User */}
            <div className="flex items-center gap-3 ml-4">
                {/* Search bar */}
                <div className="hidden md:flex items-center relative">
                    <SearchIcon className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                        type="search"
                        placeholder="Buscar…"
                        aria-label="Busca global"
                        className={`
                            w-52 lg:w-64 h-9 rounded-lg border border-slate-200 bg-slate-50/80
                            pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400
                            focus:outline-none focus:ring-2 focus:ring-[#0000FF]/15 focus:border-[#0000FF] focus:bg-white
                            transition-all duration-200
                        `}
                    />
                </div>

                {/* Notifications */}
                <button
                    aria-label="Notificações"
                    className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200 cursor-pointer"
                >
                    <BellIcon className="h-[18px] w-[18px]" />
                    {/* Notification dot */}
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#EE6600] ring-2 ring-white" />
                </button>

                {/* Divider */}
                <div className="h-8 w-px bg-slate-200 hidden sm:block" />

                {/* User profile */}
                <div className="flex items-center gap-2.5 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors duration-200">
                    <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-[#0000FF] to-[#0099DD] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block min-w-0">
                        <p className="text-sm font-semibold text-slate-700 leading-tight truncate">
                            {userName}
                        </p>
                        <p className="text-[11px] text-slate-400 leading-tight">
                            {ROLE_LABELS[userRole] ?? userRole}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    )
}
