'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { routeSchema, type RouteFormValues } from '@/lib/schemas/support'
import { cn } from '@/lib/utils'

interface BoardingPoint { id: string; name: string }

interface Props {
    defaultValues?: Partial<RouteFormValues>
    boardingPoints: BoardingPoint[]
    onSubmit: (values: RouteFormValues) => Promise<void>
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
    'focus:outline-none focus:ring-2 focus:ring-[#0000FF]/20 focus:border-[#0000FF] transition-colors bg-white',
    error ? 'border-red-400 bg-red-50' : 'border-slate-300'
)

export function RouteForm({ defaultValues, boardingPoints, onSubmit, onCancel, isEdit = false }: Props) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RouteFormValues>({
        resolver: zodResolver(routeSchema),
        defaultValues: { active: true, direction: 'going', boardingPointIds: [], ...defaultValues },
    })

    const selectedPoints = watch('boardingPointIds')

    const togglePoint = (id: string) => {
        if (selectedPoints.includes(id)) {
            setValue('boardingPointIds', selectedPoints.filter(p => p !== id), { shouldValidate: true })
        } else {
            setValue('boardingPointIds', [...selectedPoints, id], { shouldValidate: true })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nome da Rota *" error={errors.name?.message}>
                    <input {...register('name')} placeholder="Ex: Linha 01 - Centro" className={inputClass(errors.name?.message)} />
                </Field>
                <Field label="Horário de Partida *" error={errors.departureTime?.message}>
                    <input {...register('departureTime')} type="time" className={inputClass(errors.departureTime?.message)} />
                </Field>
            </div>

            <Field label="Descrição" error={errors.description?.message}>
                <input {...register('description')} placeholder="Ex: Sai da Praça Central, passa pela Rodoviária..." className={inputClass(errors.description?.message)} />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Sentido da Rota *" error={errors.direction?.message}>
                    <select {...register('direction')} className={inputClass(errors.direction?.message)}>
                        <option value="going">Ida (Campo Alegre → Destino)</option>
                        <option value="returning">Volta (Destino → Campo Alegre)</option>
                    </select>
                </Field>
                <div className="flex items-center pt-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" {...register('active')} className="h-4 w-4 rounded border-slate-300 text-[#0000FF] focus:ring-[#0000FF]" />
                        <span className="text-sm font-medium text-slate-700">Rota ativa</span>
                    </label>
                </div>
            </div>

            <div className="pt-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Pontos de Embarque Vinculados</label>
                {errors.boardingPointIds?.message && <p className="mb-2 text-xs text-red-600">{errors.boardingPointIds.message}</p>}
                {boardingPoints.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">Nenhum ponto de embarque cadastrado no sistema.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                        {boardingPoints.map(bp => {
                            const checked = selectedPoints.includes(bp.id)
                            return (
                                <label key={bp.id} className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                                    checked ? "border-[#0000FF] bg-blue-50/50" : "border-slate-200 hover:bg-slate-50"
                                )}>
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => togglePoint(bp.id)}
                                        className="h-4 w-4 rounded border-slate-300 text-[#0000FF] focus:ring-[#0000FF]"
                                    />
                                    <span className="text-sm text-slate-800">{bp.name}</span>
                                </label>
                            )
                        })}
                    </div>
                )}
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
                    {isEdit ? 'Salvar alterações' : 'Cadastrar rota'}
                </button>
            </div>
        </form>
    )
}
