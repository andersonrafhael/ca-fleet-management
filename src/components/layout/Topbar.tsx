'use client'

import { BellIcon, UserCircleIcon } from 'lucide-react'

interface TopbarProps {
    title: string
    userName?: string
    userRole?: string
}

const ROLE_LABELS: Record<string, string> = {
    admin: 'Administrador',
    operator: 'Operador',
    driver: 'Motorista',
}

export function Topbar({ title, userName = 'Usuário', userRole = 'admin' }: TopbarProps) {
    return (
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6 flex-shrink-0">
            <h1 className="text-base font-semibold text-slate-800 truncate">{title}</h1>
            <div className="flex items-center gap-4">
                <button
                    aria-label="Notificações"
                    className="relative rounded-full p-1.5 text-slate-500 hover:bg-slate-100 transition-colors"
                >
                    <BellIcon className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2 text-sm">
                    <UserCircleIcon className="h-6 w-6 text-slate-400" />
                    <div className="hidden sm:block">
                        <p className="font-medium text-slate-700 leading-tight">{userName}</p>
                        <p className="text-xs text-slate-400">{ROLE_LABELS[userRole] ?? userRole}</p>
                    </div>
                </div>
            </div>
        </header>
    )
}
