'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Building2,
    MapPin,
    Route,
    Bus,
    UserCheck,
    CalendarDays,
    BarChart3,
    ScrollText,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface NavItem {
    label: string
    href: string
    icon: React.ElementType
    roles?: string[]
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Painel', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Alunos', href: '/students', icon: Users },
    { label: 'Instituições', href: '/institutions', icon: Building2 },
    { label: 'Pontos de Embarque', href: '/boarding-points', icon: MapPin },
    { label: 'Rotas', href: '/routes', icon: Route },
    { label: 'Veículos', href: '/vehicles', icon: Bus },
    { label: 'Motoristas', href: '/drivers', icon: UserCheck },
    { label: 'Dias de Operação', href: '/operation-days', icon: CalendarDays },
    { label: 'Relatórios', href: '/reports', icon: BarChart3 },
    { label: 'Logs de Auditoria', href: '/audit-logs', icon: ScrollText, roles: ['admin'] },
]

interface SidebarProps {
    userRole?: string
}

export function Sidebar({ userRole = 'admin' }: SidebarProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    const visibleItems = NAV_ITEMS.filter(
        (item) => !item.roles || item.roles.includes(userRole)
    )

    return (
        <aside
            className={cn(
                'group/sidebar flex flex-col h-full bg-gradient-to-b from-[#0A1128] to-[#0F172A] text-slate-100',
                'transition-all duration-300 ease-in-out relative',
                collapsed ? 'w-[72px]' : 'w-[260px]'
            )}
        >
            {/* Logo area */}
            <div
                className={cn(
                    'flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]',
                    collapsed && 'justify-center px-3'
                )}
            >
                <div className="flex-shrink-0 w-9 h-9 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center shadow-lg shadow-blue-900/30">
                    <Image
                        src="/brand/heart-logo.svg"
                        alt="Campo Alegre"
                        width={28}
                        height={28}
                        className="object-contain"
                    />
                </div>
                {!collapsed && (
                    <div className="min-w-0 animate-[fade-in_0.2s_ease-out]">
                        <p className="text-[13px] font-bold text-white leading-tight truncate tracking-tight">
                            Transporte Universitário
                        </p>
                        <p className="text-[11px] text-slate-400/80 truncate">
                            Campo Alegre · AL
                        </p>
                    </div>
                )}
            </div>

            {/* Section label */}
            {!collapsed && (
                <div className="px-5 pt-5 pb-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Menu principal
                    </p>
                </div>
            )}

            {/* Navigation */}
            <nav className={cn('flex-1 overflow-y-auto overflow-x-hidden', collapsed ? 'py-4' : 'pb-4')}>
                <ul className="space-y-0.5 px-2">
                    {visibleItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    title={collapsed ? item.label : undefined}
                                    className={cn(
                                        'group/item relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium',
                                        'transition-all duration-200',
                                        isActive
                                            ? 'bg-white/[0.12] text-white shadow-sm shadow-black/10'
                                            : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200',
                                        collapsed && 'justify-center px-2.5'
                                    )}
                                >
                                    {/* Active indicator bar */}
                                    {isActive && (
                                        <span
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#0099DD]"
                                            style={{ animation: 'slide-in-left 0.2s ease-out' }}
                                        />
                                    )}

                                    <item.icon
                                        className={cn(
                                            'flex-shrink-0 h-[18px] w-[18px] transition-colors duration-200',
                                            isActive ? 'text-[#66CCFF]' : 'text-slate-500 group-hover/item:text-slate-300'
                                        )}
                                        aria-hidden="true"
                                    />
                                    {!collapsed && (
                                        <span className="truncate">{item.label}</span>
                                    )}

                                    {/* Tooltip for collapsed mode */}
                                    {collapsed && (
                                        <span
                                            className={cn(
                                                'absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium',
                                                'bg-slate-800 text-white shadow-lg shadow-black/20 border border-white/10',
                                                'opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible',
                                                'transition-all duration-150 whitespace-nowrap z-50',
                                                'pointer-events-none'
                                            )}
                                        >
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* Collapse toggle */}
            <div className="py-3 px-2 border-t border-white/[0.06]">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={collapsed ? 'Expandir menu' : 'Colapsar menu'}
                    className={cn(
                        'flex items-center gap-2 w-full rounded-xl px-3 py-2.5 text-[13px]',
                        'text-slate-500 hover:bg-white/[0.06] hover:text-slate-300 transition-all duration-200',
                        'cursor-pointer',
                        collapsed && 'justify-center px-2.5'
                    )}
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                    {!collapsed && <span>Colapsar</span>}
                </button>
            </div>
        </aside>
    )
}
