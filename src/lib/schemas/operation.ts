import { z } from 'zod'

export const operationDaySchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD esperado'),
})
export type OperationDayFormValues = z.infer<typeof operationDaySchema>

export const tripConfigSchema = z.object({
    routeId: z.string().min(1, 'Selecione uma rota'),
    vehicleId: z.string().min(1, 'Selecione um veículo'),
    driverId: z.string().min(1, 'Selecione um motorista'),
    departureTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM esperado'),
})
export type TripConfigFormValues = z.infer<typeof tripConfigSchema>

export const OPERATION_STATUS_COLORS: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    published: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
}

export const OPERATION_STATUS_LABELS: Record<string, string> = {
    draft: 'Rascunho',
    published: 'Publicado',
    completed: 'Concluído',
}
