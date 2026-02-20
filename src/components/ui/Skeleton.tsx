import { cn } from '@/lib/utils'

/* ─── Skeleton ──────────────────────────────────────────────────── */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Width in CSS units */
    width?: string
    /** Height in CSS units */
    height?: string
}

export function Skeleton({ className, width, height, style, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                'rounded-md bg-gradient-to-r from-slate-100 via-slate-200/70 to-slate-100',
                'bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]',
                className
            )}
            style={{ width, height, ...style }}
            aria-hidden="true"
            {...props}
        />
    )
}

/* ─── EmptyState ────────────────────────────────────────────────── */
interface EmptyStateProps {
    icon?: React.ReactNode
    title: string
    description?: string
    action?: React.ReactNode
    className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
            {icon && (
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    {icon}
                </div>
            )}
            <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
            {description && (
                <p className="mt-1 text-sm text-slate-500 max-w-xs">{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    )
}
