import { z } from 'zod'

// CPF validation (basic: 11 numeric digits — full digit verification can be added)
export const studentSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    cpf: z
        .string()
        .regex(/^\d{11}$/, 'CPF deve ter 11 dígitos numéricos')
        .or(z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')),
    email: z.string().email('E-mail inválido').optional().or(z.literal('')),
    phone: z.string().optional(),
    course: z.string().optional(),
    status: z.enum(['active', 'inactive', 'suspended']).default('active'),
    institutionId: z.string().uuid('Selecione uma instituição'),
    boardingPointId: z.string().uuid('Selecione um ponto de embarque'),
})

export type StudentFormValues = z.infer<typeof studentSchema>

export const STATUS_LABELS: Record<string, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    suspended: 'Suspenso',
}

export const STATUS_COLORS: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-slate-100 text-slate-600',
    suspended: 'bg-orange-100 text-orange-700',
}
