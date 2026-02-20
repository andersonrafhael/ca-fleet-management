'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { driverSchema, type DriverFormValues } from '@/lib/schemas/support'
import { cn } from '@/lib/utils'
import { AlertCircleIcon } from 'lucide-react'

interface Props {
    defaultValues?: Partial<DriverFormValues>
    onSubmit: (values: DriverFormValues) => Promise<void>
    onCancel?: () => void
    isEdit?: boolean
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">{label}</label>
            {children}
            {error && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 animate-[slideUp_0.2s_ease-out]">
                    <AlertCircleIcon className="h-3 w-3 flex-shrink-0" />{error}
                </p>
            )}
        </div>
    )
}

const inputClass = (error?: string) => cn(
    'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400',
    'focus:outline-none focus:ring-2 focus:ring-[#0000FF]/10 focus:border-[#0000FF] transition-all duration-200',
    error ? 'border-red-300 bg-red-50/50 ring-1 ring-red-200' : 'border-slate-200 hover:border-slate-300'
)

export function DriverForm({ defaultValues, onSubmit, onCancel, isEdit = false }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<DriverFormValues>({
        resolver: zodResolver(driverSchema),
        defaultValues: { status: 'active', cnhCategory: 'D', ...defaultValues },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nome Completo *" error={errors.name?.message}>
                    <input {...register('name')} placeholder="Ex: José Silva" className={inputClass(errors.name?.message)} autoFocus />
                </Field>
                <Field label="CPF *" error={errors.cpf?.message}>
                    <input {...register('cpf')} placeholder="Apenas números" maxLength={14} className={inputClass(errors.cpf?.message)} />
                </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="CNH *" error={errors.cnh?.message}>
                    <input {...register('cnh')} placeholder="Número do registro" className={inputClass(errors.cnh?.message)} />
                </Field>
                <Field label="Categoria CNH *" error={errors.cnhCategory?.message}>
                    <select {...register('cnhCategory')} className={inputClass(errors.cnhCategory?.message)}>
                        <option value="D">Categoria D (Micro/Ônibus base)</option>
                        <option value="E">Categoria E (Articulados/Pesados)</option>
                    </select>
                </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Telefone" error={errors.phone?.message}>
                    <input {...register('phone')} placeholder="(00) 00000-0000" className={inputClass(errors.phone?.message)} />
                </Field>
                <Field label="Status *" error={errors.status?.message}>
                    <select {...register('status')} className={inputClass(errors.status?.message)}>
                        <option value="active">Ativo (Pode ser escalado)</option>
                        <option value="vacation">Férias / Licença</option>
                        <option value="inactive">Inativo</option>
                    </select>
                </Field>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                {onCancel && (
                    <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer">
                        Cancelar
                    </button>
                )}
                <button type="submit" disabled={isSubmitting} className="rounded-xl bg-[#0000FF] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0000DD] hover:shadow-md hover:shadow-blue-500/20 disabled:opacity-60 transition-all duration-200 flex items-center gap-2 cursor-pointer">
                    {isSubmitting && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                    {isEdit ? 'Salvar alterações' : 'Cadastrar motorista'}
                </button>
            </div>
        </form>
    )
}
