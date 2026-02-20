import * as React from 'react'
import { cn } from '@/lib/utils'

/* ─── Card ──────────────────────────────────────────────────────── */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean
    padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
}

export function Card({ className, hover = false, padding = 'md', children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'bg-white rounded-xl border border-slate-200/80',
                'shadow-[0_1px_3px_0_rgb(0_0_0/0.04),0_1px_2px_-1px_rgb(0_0_0/0.03)]',
                hover && 'transition-shadow duration-200 hover:shadow-[0_4px_12px_-2px_rgb(0_0_0/0.08),0_2px_4px_-2px_rgb(0_0_0/0.04)]',
                paddings[padding],
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

/* ─── CardHeader ────────────────────────────────────────────────── */
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    description?: string
    action?: React.ReactNode
}

export function CardHeader({ title, description, action, className, ...props }: CardHeaderProps) {
    return (
        <div
            className={cn(
                'flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl',
                className
            )}
            {...props}
        >
            <div className="min-w-0">
                <h3 className="text-base font-semibold text-slate-800">{title}</h3>
                {description && (
                    <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                )}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    )
}
