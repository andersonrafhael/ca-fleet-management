import * as React from 'react'
import { cn } from '@/lib/utils'

/* ─── Input ─────────────────────────────────────────────────────── */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string
    icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, icon, type = 'text', ...props }, ref) => {
        return (
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={cn(
                        'flex h-10 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-800',
                        'shadow-[0_1px_2px_0_rgb(0_0_0/0.03)]',
                        'placeholder:text-slate-400',
                        'focus:outline-none focus:ring-2 focus:ring-[#0000FF]/15 focus:border-[#0000FF]',
                        'transition-all duration-200',
                        'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50',
                        error
                            ? 'border-red-400 bg-red-50/50 focus:ring-red-500/15 focus:border-red-500'
                            : 'border-slate-300',
                        icon && 'pl-10',
                        className
                    )}
                    {...props}
                />
            </div>
        )
    }
)
Input.displayName = 'Input'

/* ─── Select ────────────────────────────────────────────────────── */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, error, children, ...props }, ref) => {
        return (
            <select
                ref={ref}
                className={cn(
                    'flex h-10 w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-800',
                    'shadow-[0_1px_2px_0_rgb(0_0_0/0.03)]',
                    'focus:outline-none focus:ring-2 focus:ring-[#0000FF]/15 focus:border-[#0000FF]',
                    'transition-all duration-200 appearance-none cursor-pointer',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50',
                    error
                        ? 'border-red-400 bg-red-50/50'
                        : 'border-slate-300',
                    className
                )}
                {...props}
            >
                {children}
            </select>
        )
    }
)
Select.displayName = 'Select'

/* ─── FormField ─────────────────────────────────────────────────── */
interface FormFieldProps {
    label: string
    error?: string
    required?: boolean
    children: React.ReactNode
    className?: string
}

export function FormField({ label, error, required, children, className }: FormFieldProps) {
    return (
        <div className={cn('space-y-1.5', className)}>
            <label className="block text-sm font-medium text-slate-700">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {children}
            {error && (
                <p className="flex items-center gap-1 text-xs text-red-600 animate-[slide-up_0.2s_ease-out]">
                    <svg className="h-3 w-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    )
}
