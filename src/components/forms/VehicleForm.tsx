'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { vehicleSchema, type VehicleFormValues, VEHICLE_TYPES } from '@/lib/schemas/support'
import { cn } from '@/lib/utils'
import { AlertCircleIcon } from 'lucide-react'

interface Props {
    defaultValues?: Partial<VehicleFormValues>
    onSubmit: (values: VehicleFormValues) => Promise<void>
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

export function VehicleForm({ defaultValues, onSubmit, onCancel, isEdit = false }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: { status: 'active', type: 'bus', capacity: 40, year: new Date().getFullYear(), currentKm: 0, ...defaultValues },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Placa *" error={errors.licensePlate?.message}>
                    <input {...register('licensePlate')} placeholder="ABC-1234 ou ABC1D23" className={inputClass(errors.licensePlate?.message)} autoFocus />
                </Field>
                <Field label="Tipo *" error={errors.type?.message}>
                    <select {...register('type')} className={inputClass(errors.type?.message)}>
                        {Object.entries(VEHICLE_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Marca *" error={errors.brand?.message}>
                    <input {...register('brand')} placeholder="Ex: Mercedes-Benz" className={inputClass(errors.brand?.message)} />
                </Field>
                <Field label="Modelo *" error={errors.model?.message}>
                    <input {...register('model')} placeholder="Ex: OF-1721" className={inputClass(errors.model?.message)} />
                </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Ano *" error={errors.year?.message}>
                    <input type="number" {...register('year')} className={inputClass(errors.year?.message)} />
                </Field>
                <Field label="Capacidade *" error={errors.capacity?.message}>
                    <input type="number" {...register('capacity')} className={inputClass(errors.capacity?.message)} />
                </Field>
                <Field label="Quilometragem (KM)" error={errors.currentKm?.message}>
                    <input type="number" {...register('currentKm')} className={inputClass(errors.currentKm?.message)} />
                </Field>
            </div>

            <Field label="Status *" error={errors.status?.message}>
                <select {...register('status')} className={inputClass(errors.status?.message)}>
                    <option value="active">Ativo (Em circulação)</option>
                    <option value="maintenance">Em Manutenção</option>
                    <option value="inactive">Inativo (Aposentado)</option>
                </select>
            </Field>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                {onCancel && (
                    <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer">
                        Cancelar
                    </button>
                )}
                <button type="submit" disabled={isSubmitting} className="rounded-xl bg-[#0000FF] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0000DD] hover:shadow-md hover:shadow-blue-500/20 disabled:opacity-60 transition-all duration-200 flex items-center gap-2 cursor-pointer">
                    {isSubmitting && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                    {isEdit ? 'Salvar alterações' : 'Cadastrar veículo'}
                </button>
            </div>
        </form>
    )
}
