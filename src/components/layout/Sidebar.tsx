'use client'

import Link from 'next/link'
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
    ClipboardList,
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
                'flex flex-col h-full bg-[#0F172A] text-slate-100 transition-all duration-300 ease-in-out',
                collapsed ? 'w-16' : 'w-64'
            )}
        >
            {/* Logo */}
            <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-slate-700', collapsed && 'justify-center px-2')}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0000FF] flex items-center justify-center text-white font-bold text-sm">
                    CA
                </div>
                {!collapsed && (
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-white leading-tight truncate">Transporte Universitário</p>
                        <p className="text-xs text-slate-400 truncate">Campo Alegre · AL</p>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
                <ul className="space-y-1 px-2">
                    {visibleItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    title={collapsed ? item.label : undefined}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-[#0000FF] text-white'
                                            : 'text-slate-300 hover:bg-slate-700 hover:text-white',
                                        collapsed && 'justify-center px-2'
                                    )}
                                >
                                    <item.icon className="flex-shrink-0 h-4 w-4" aria-hidden="true" />
                                    {!collapsed && <span className="truncate">{item.label}</span>}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* Collapse toggle */}
            <div className="py-4 px-2 border-t border-slate-700">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={collapsed ? 'Expandir menu' : 'Colapsar menu'}
                    className={cn(
                        'flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-700 hover:text-white transition-colors',
                        collapsed && 'justify-center px-2'
                    )}
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    {!collapsed && <span>Colapsar</span>}
                </button>
            </div>
        </aside>
    )
}
