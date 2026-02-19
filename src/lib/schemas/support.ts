import { z } from 'zod'

// Institutions
export const institutionSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    city: z.string().optional(),
    active: z.boolean().default(true),
})
export type InstitutionFormValues = z.infer<typeof institutionSchema>

// Boarding Points
export const boardingPointSchema = z.object({
    name: z.string().min(3, 'Nome/Referência muito curta'),
    address: z.string().optional(),
    active: z.boolean().default(true),
})
export type BoardingPointFormValues = z.infer<typeof boardingPointSchema>

// Routes
export const routeSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    direction: z.enum(['going', 'returning']).default('going'),
    description: z.string().optional(),
    departureTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM esperado').optional(),
    boardingPointIds: z.array(z.string()).default([]),
    active: z.boolean().default(true),
})
export type RouteFormValues = z.infer<typeof routeSchema>

const currentYear = new Date().getFullYear()

// Vehicles
export const vehicleSchema = z.object({
    licensePlate: z.string().regex(/^[A-Z]{3}-?\d[A-Z\d]\d{2}$/i, 'Placa inválida (Mercosul ou antiga)'),
    brand: z.string().min(2, 'Marca é obrigatória'),
    model: z.string().min(2, 'Modelo é obrigatória'),
    year: z.coerce.number().min(1980, 'Ano inválido').max(currentYear + 1, 'Ano inválido'),
    capacity: z.coerce.number().min(1, 'Capacidade inválida'),
    type: z.enum(['bus', 'minibus', 'van']).default('bus'),
    status: z.enum(['active', 'maintenance', 'inactive']).default('active'),
    currentKm: z.coerce.number().min(0, 'KM inválido').default(0),
})
export type VehicleFormValues = z.infer<typeof vehicleSchema>

export const VEHICLE_TYPES: Record<string, string> = {
    bus: 'Ônibus',
    minibus: 'Micro-ônibus',
    van: 'Van',
}

// Drivers
export const driverSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    cpf: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos numéricos').or(z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')),
    cnh: z.string().min(5, 'CNH inválida'),
    cnhCategory: z.enum(['D', 'E']),
    phone: z.string().optional(),
    status: z.enum(['active', 'inactive', 'vacation']).default('active'),
})
export type DriverFormValues = z.infer<typeof driverSchema>
