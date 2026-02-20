'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { studentSchema, type StudentFormValues, STATUS_LABELS } from '@/lib/schemas/student'
import { cn } from '@/lib/utils'
import { AlertCircleIcon } from 'lucide-react'

interface Institution { id: string; name: string }
interface BoardingPoint { id: string; name: string }

interface StudentFormProps {
    defaultValues?: Partial<StudentFormValues>
    institutions: Institution[]
    boardingPoints: BoardingPoint[]
    onSubmit: (values: StudentFormValues) => Promise<void>
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

export function StudentForm({
    defaultValues,
    institutions,
    boardingPoints,
    onSubmit,
    onCancel,
    isEdit = false,
}: StudentFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<StudentFormValues>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            status: 'active',
            ...defaultValues,
        },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name + CPF */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nome completo *" error={errors.name?.message}>
                    <input
                        {...register('name')}
                        placeholder="Ex: Ana Beatriz Ferreira"
                        className={inputClass(errors.name?.message)}
                    />
                </Field>
                <Field label="CPF *" error={errors.cpf?.message}>
                    <input
                        {...register('cpf')}
                        placeholder="00000000000"
                        maxLength={11}
                        className={inputClass(errors.cpf?.message)}
                    />
                </Field>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="E-mail" error={errors.email?.message}>
                    <input
                        {...register('email')}
                        type="email"
                        placeholder="aluno@email.com"
                        className={inputClass(errors.email?.message)}
                    />
                </Field>
                <Field label="Telefone" error={errors.phone?.message}>
                    <input
                        {...register('phone')}
                        placeholder="(82) 99999-9999"
                        className={inputClass(errors.phone?.message)}
                    />
                </Field>
            </div>

            {/* Course */}
            <Field label="Curso" error={errors.course?.message}>
                <input
                    {...register('course')}
                    placeholder="Ex: Medicina"
                    className={inputClass(errors.course?.message)}
                />
            </Field>

            {/* Institution + Boarding Point */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Instituição *" error={errors.institutionId?.message}>
                    <select {...register('institutionId')} className={inputClass(errors.institutionId?.message)}>
                        <option value="">Selecione a instituição…</option>
                        {institutions.map((i) => (
                            <option key={i.id} value={i.id}>{i.name}</option>
                        ))}
                    </select>
                </Field>
                <Field label="Ponto de embarque *" error={errors.boardingPointId?.message}>
                    <select {...register('boardingPointId')} className={inputClass(errors.boardingPointId?.message)}>
                        <option value="">Selecione o ponto…</option>
                        {boardingPoints.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </Field>
            </div>

            {/* Status */}
            <Field label="Status" error={errors.status?.message}>
                <select {...register('status')} className={inputClass(errors.status?.message)}>
                    {Object.entries(STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                    ))}
                </select>
            </Field>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600
                       hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-[#0000FF] px-6 py-2.5 text-sm font-semibold text-white
                     hover:bg-[#0000DD] hover:shadow-md hover:shadow-blue-500/20 disabled:opacity-60
                     transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                    {isSubmitting && (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    )}
                    {isEdit ? 'Salvar alterações' : 'Cadastrar aluno'}
                </button>
            </div>
        </form>
    )
}
