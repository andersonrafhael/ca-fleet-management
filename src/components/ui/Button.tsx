import * as React from 'react'
import { cn } from '@/lib/utils'

/* ─── Variant maps ──────────────────────────────────────────────── */
const variants = {
    primary:
        'bg-[#0000FF] text-white hover:bg-[#0000CC] focus-visible:ring-[#0000FF]/40 shadow-sm',
    secondary:
        'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-400/30',
    destructive:
        'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/40 shadow-sm',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    link: 'text-[#0000FF] underline-offset-4 hover:underline p-0 h-auto',
} as const

const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
    md: 'h-9 px-4 text-sm gap-2 rounded-lg',
    lg: 'h-10 px-5 text-sm gap-2 rounded-lg',
    icon: 'h-9 w-9 rounded-lg',
} as const

/* ─── Types ─────────────────────────────────────────────────────── */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof variants
    size?: keyof typeof sizes
    loading?: boolean
}

/* ─── Component ─────────────────────────────────────────────────── */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    'inline-flex items-center justify-center font-semibold transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
                    'active:scale-[0.98] cursor-pointer',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {loading && (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                {children}
            </button>
        )
    }
)
Button.displayName = 'Button'
