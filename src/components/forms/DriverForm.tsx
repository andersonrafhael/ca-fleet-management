'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { driverSchema, type DriverFormValues } from '@/lib/schemas/support'
import { cn } from '@/lib/utils'

interface Props {
    defaultValues?: Partial<DriverFormValues>
    onSubmit: (values: DriverFormValues) => Promise<void>
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
                    <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        Cancelar
                    </button>
                )}
                <button type="submit" disabled={isSubmitting} className="rounded-lg bg-[#0000FF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0000CC] disabled:opacity-60 transition-colors flex items-center gap-2">
                    {isSubmitting && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                    {isEdit ? 'Salvar alterações' : 'Cadastrar motorista'}
                </button>
            </div>
        </form>
    )
}
