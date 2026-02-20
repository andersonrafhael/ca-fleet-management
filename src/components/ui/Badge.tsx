import { cn } from '@/lib/utils'

/* ─── Variant maps ──────────────────────────────────────────────── */
const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-[#0000FF]/10 text-[#0000FF] border-[#0000FF]/20',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
} as const

const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-1',
} as const

/* ─── Types ─────────────────────────────────────────────────────── */
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: keyof typeof variants
    size?: keyof typeof sizes
}

/* ─── Component ─────────────────────────────────────────────────── */
export function Badge({ className, variant = 'default', size = 'md', ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full border font-medium leading-none whitespace-nowrap',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    )
}
