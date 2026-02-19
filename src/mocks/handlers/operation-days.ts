import { http, HttpResponse } from 'msw'
import { STUDENTS } from './students'
import { VEHICLES, DRIVERS, ROUTES } from './institutions'

// Seeded operation days
const OPERATION_DAYS = [
    {
        id: 'opday-001',
        date: '2025-03-03',
        status: 'published',
        tripCount: 3,
        publishedAt: '2025-03-02T18:00:00Z',
        publishedBy: { id: 'user-admin-1', name: 'Maria Silva', email: 'admin@campoalegre.al.gov.br', role: 'admin' },
        createdAt: '2025-03-02T10:00:00Z',
    },
    {
        id: 'opday-002',
        date: '2025-03-04',
        status: 'draft',
        tripCount: 2,
        publishedAt: null,
        publishedBy: null,
        createdAt: '2025-03-03T16:00:00Z',
    },
]

// Trip seed (associated to opday-001)
const TRIPS = [
    {
        id: 'trip-001',
        operationDayId: 'opday-001',
        route: ROUTES[0],
        vehicle: VEHICLES[0],
        driver: DRIVERS[0],
        status: 'active',
        departureTime: '2025-03-03T06:30:00-03:00',
        scheduledCount: 12,
        checkedInCount: 7,
    },
    {
        id: 'trip-002',
        operationDayId: 'opday-001',
        route: ROUTES[1],
        vehicle: VEHICLES[1],
        driver: DRIVERS[1],
        status: 'planned',
        departureTime: '2025-03-03T18:00:00-03:00',
        scheduledCount: 12,
        checkedInCount: 0,
    },
    {
        id: 'trip-003',
        operationDayId: 'opday-001',
        route: ROUTES[2],
        vehicle: VEHICLES[3],
        driver: DRIVERS[2],
        status: 'closed',
        departureTime: '2025-03-03T06:45:00-03:00',
        scheduledCount: 8,
        checkedInCount: 6,
    },
]

// Attendance records
const ATTENDANCE: Array<{
    id: string; studentId: string; tripId: string; method: string
    biometricConfidence?: number; checkedInAt: string; operatorId: string
}> = [
        { id: 'att-001', studentId: 'student-001', tripId: 'trip-001', method: 'biometric', biometricConfidence: 0.94, checkedInAt: '2025-03-03T06:33:00Z', operatorId: 'user-driver-1' },
        { id: 'att-002', studentId: 'student-002', tripId: 'trip-001', method: 'manual', checkedInAt: '2025-03-03T06:35:00Z', operatorId: 'user-driver-1' },
        { id: 'att-003', studentId: 'student-003', tripId: 'trip-001', method: 'biometric', biometricConfidence: 0.89, checkedInAt: '2025-03-03T06:36:00Z', operatorId: 'user-driver-1' },
    ]

function paginate<T>(arr: T[], page: number, limit: number) {
    return { data: arr.slice((page - 1) * limit, page * limit), total: arr.length, page, limit }
}

export const operationDayHandlers = [
    http.get('/api/v1/operation-days', ({ request }) => {
        const url = new URL(request.url)
        const page = Number(url.searchParams.get('page') ?? 1)
        const limit = Number(url.searchParams.get('limit') ?? 20)
        const status = url.searchParams.get('status')
        let filtered = [...OPERATION_DAYS]
        if (status) filtered = filtered.filter((d) => d.status === status)
        return HttpResponse.json(paginate(filtered, page, limit))
    }),

    http.get('/api/v1/operation-days/:id', ({ params }) => {
        const day = OPERATION_DAYS.find((d) => d.id === params.id)
        if (!day) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
        const trips = TRIPS.filter((t) => t.operationDayId === params.id)
        return HttpResponse.json({ ...day, trips })
    }),

    http.post('/api/v1/operation-days', async ({ request }) => {
        const body = await request.json() as { date: string }
        const newDay = {
            id: `opday-${Date.now()}`,
            date: body.date,
            status: 'draft',
            tripCount: 0,
            publishedAt: null,
            publishedBy: null,
            createdAt: new Date().toISOString(),
        }
        OPERATION_DAYS.push(newDay as typeof OPERATION_DAYS[0])
        return HttpResponse.json(newDay, { status: 201 })
    }),

    http.put('/api/v1/operation-days/:id', async ({ params, request }) => {
        const idx = OPERATION_DAYS.findIndex((d) => d.id === params.id)
        if (idx === -1) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
        if (OPERATION_DAYS[idx].status === 'published') {
            return HttpResponse.json({ message: 'Dia publicado não pode ser editado' }, { status: 409 })
        }
        const body = await request.json() as Partial<typeof OPERATION_DAYS[0]>
        Object.assign(OPERATION_DAYS[idx], body)
        return HttpResponse.json(OPERATION_DAYS[idx])
    }),

    http.post('/api/v1/operation-days/:id/publish', ({ params }) => {
        const idx = OPERATION_DAYS.findIndex((d) => d.id === params.id)
        if (idx === -1) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
        if (OPERATION_DAYS[idx].status === 'published') {
            return HttpResponse.json({ message: 'Já publicado' }, { status: 409 })
        }
        OPERATION_DAYS[idx] = {
            ...OPERATION_DAYS[idx],
            status: 'published',
            publishedAt: new Date().toISOString(),
            publishedBy: { id: 'user-admin-1', name: 'Maria Silva', email: 'admin@campoalegre.al.gov.br', role: 'admin' },
        } as typeof OPERATION_DAYS[0]
        return HttpResponse.json(OPERATION_DAYS[idx])
    }),
]

export const tripHandlers = [
    http.get('/api/v1/trips/:id', ({ params }) => {
        const trip = TRIPS.find((t) => t.id === params.id)
        if (!trip) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })

        // Build boarding list: 12 students assigned to this trip
        const startIdx = params.id === 'trip-001' ? 0 : params.id === 'trip-002' ? 12 : 20
        const tripPassengers = STUDENTS.slice(startIdx, startIdx + trip.scheduledCount).map((s, i) => {
            const att = ATTENDANCE.find((a) => a.studentId === s.id && a.tripId === params.id)
            return {
                student: s,
                checkedIn: !!att,
                checkinMethod: att?.method ?? null,
                checkinAt: att?.checkedInAt ?? null,
            }
        })

        return HttpResponse.json({
            ...trip,
            passengers: tripPassengers,
            kmStart: trip.status === 'closed' ? 87432 : null,
            kmEnd: trip.status === 'closed' ? 87598 : null,
            occurrences: trip.status === 'closed' ? [] : [],
        })
    }),

    http.post('/api/v1/trips/:id/attendance', async ({ params, request }) => {
        await new Promise((r) => setTimeout(r, 800)) // simulate API latency
        const body = await request.json() as {
            studentId: string; method: string; justification?: string
            attemptId?: string; biometricConfidence?: number
        }

        // Biometric 85% success rate simulation
        if (body.method === 'biometric' && Math.random() < 0.15) {
            return HttpResponse.json({ message: 'Confiança biométrica insuficiente', error: 'LOW_CONFIDENCE' }, { status: 400 })
        }

        // Duplicate check
        const existing = ATTENDANCE.find((a) => a.studentId === body.studentId && a.tripId === params.id as string)
        if (existing) {
            return HttpResponse.json({ message: 'Presença já registrada para este aluno nesta viagem' }, { status: 409 })
        }

        const record = {
            id: `att-${Date.now()}`,
            studentId: body.studentId,
            tripId: params.id as string,
            method: body.method,
            biometricConfidence: body.biometricConfidence,
            checkedInAt: new Date().toISOString(),
            operatorId: 'user-driver-1',
        }
        ATTENDANCE.push(record)

        // Update trip counter
        const tripIdx = TRIPS.findIndex((t) => t.id === params.id)
        if (tripIdx !== -1) TRIPS[tripIdx].checkedInCount++

        return HttpResponse.json(record, { status: 201 })
    }),

    http.delete('/api/v1/trips/:id/attendance/:studentId', ({ params }) => {
        const idx = ATTENDANCE.findIndex((a) => a.studentId === params.studentId && a.tripId === params.id)
        if (idx !== -1) ATTENDANCE.splice(idx, 1)
        const tripIdx = TRIPS.findIndex((t) => t.id === params.id)
        if (tripIdx !== -1 && TRIPS[tripIdx].checkedInCount > 0) TRIPS[tripIdx].checkedInCount--
        return new HttpResponse(null, { status: 204 })
    }),

    http.post('/api/v1/trips/:id/close', async ({ params, request }) => {
        const body = await request.json() as { kmStart: number; kmEnd: number; occurrences?: string[] }
        const trip = TRIPS.find((t) => t.id === params.id)
        if (!trip) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })

        const checkedIn = ATTENDANCE.filter((a) => a.tripId === params.id).length
        return HttpResponse.json({
            tripId: params.id,
            scheduledCount: trip.scheduledCount,
            checkedInCount: checkedIn,
            occupancyRate: checkedIn / trip.scheduledCount,
            kmDriven: body.kmEnd - body.kmStart,
            closedAt: new Date().toISOString(),
        })
    }),
]

export { TRIPS, ATTENDANCE }
