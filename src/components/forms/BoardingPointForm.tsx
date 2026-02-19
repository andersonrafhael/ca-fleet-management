'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { boardingPointSchema, type BoardingPointFormValues } from '@/lib/schemas/support'
import { cn } from '@/lib/utils'

interface Props {
    defaultValues?: Partial<BoardingPointFormValues>
    onSubmit: (values: BoardingPointFormValues) => Promise<void>
    onCancel?: () => void
    isEdit?: boolean
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    )
}

const inputClass = (error?: string) => cn(
    'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 shadow-sm placeholder:text-slate-400',
    'focus:outline-none focus:ring-2 focus:ring-[#0000FF]/20 focus:border-[#0000FF] transition-colors',
    error ? 'border-red-400 bg-red-50' : 'border-slate-300'
)

export function BoardingPointForm({ defaultValues, onSubmit, onCancel, isEdit = false }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<BoardingPointFormValues>({
        resolver: zodResolver(boardingPointSchema),
        defaultValues: { active: true, ...defaultValues },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field label="Ponto de Embarque / Nome *" error={errors.name?.message}>
                <input
                    {...register('name')}
                    placeholder="Ex: Praça Central"
                    className={inputClass(errors.name?.message)}
                    autoFocus
                />
            </Field>

            <Field label="Endereço ou Referência" error={errors.address?.message}>
                <input
                    {...register('address')}
                    placeholder="Ex: Em frente à rodoviária"
                    className={inputClass(errors.address?.message)}
                />
            </Field>

            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    {...register('active')}
                    className="h-4 w-4 rounded border-slate-300 text-[#0000FF] focus:ring-[#0000FF]"
                />
                <span className="text-sm font-medium text-slate-700">Ponto ativo</span>
            </label>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                {onCancel && (
                    <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        Cancelar
                    </button>
                )}
                <button type="submit" disabled={isSubmitting} className="rounded-lg bg-[#0000FF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0000CC] disabled:opacity-60 transition-colors flex items-center gap-2">
                    {isSubmitting && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                    {isEdit ? 'Salvar alterações' : 'Cadastrar ponto'}
                </button>
            </div>
        </form>
    )
}
