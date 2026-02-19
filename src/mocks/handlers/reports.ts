import { http, HttpResponse } from 'msw'

// Placeholder stubs — minimal working handlers for reports & audit logs

export const reportHandlers = [
    http.get('/api/v1/reports/occupation', () => {
        return HttpResponse.json([
            { tripId: 'trip-001', date: '2025-03-03', routeName: 'Campo Alegre → UFAL (IDA)', vehiclePlate: 'ABC-1234', scheduledCount: 12, checkedInCount: 10, occupancyRate: 0.83, capacity: 42 },
            { tripId: 'trip-002', date: '2025-03-03', routeName: 'UFAL → Campo Alegre (VOLTA)', vehiclePlate: 'DEF-5678', scheduledCount: 12, checkedInCount: 9, occupancyRate: 0.75, capacity: 28 },
            { tripId: 'trip-003', date: '2025-03-03', routeName: 'Campo Alegre → CESMAC (IDA)', vehiclePlate: 'JKL-3456', scheduledCount: 8, checkedInCount: 3, occupancyRate: 0.38, capacity: 35 },
            { tripId: 'trip-004', date: '2025-03-04', routeName: 'Campo Alegre → UFAL (IDA)', vehiclePlate: 'ABC-1234', scheduledCount: 12, checkedInCount: 12, occupancyRate: 1.0, capacity: 42 },
        ])
    }),

    http.get('/api/v1/reports/fleet-km', () => {
        return HttpResponse.json([
            { vehicleId: 'veh-001', licensePlate: 'ABC-1234', model: 'OF-1721', totalKm: 342, tripCount: 12 },
            { vehicleId: 'veh-002', licensePlate: 'DEF-5678', model: 'Unity', totalKm: 285, tripCount: 10 },
            { vehicleId: 'veh-003', licensePlate: 'GHI-9012', model: 'Sprinter 415', totalKm: 0, tripCount: 0 },
            { vehicleId: 'veh-004', licensePlate: 'JKL-3456', model: 'OF-1315', totalKm: 198, tripCount: 7 },
        ])
    }),

    http.get('/api/v1/reports/monthly-summary', ({ request }) => {
        const url = new URL(request.url)
        return HttpResponse.json({
            year: Number(url.searchParams.get('year') ?? 2025),
            month: Number(url.searchParams.get('month') ?? 3),
            totalTrips: 84,
            totalKm: 8420,
            avgOccupancyRate: 0.73,
            underutilizedTrips: 18,
            estimatedFuelCost: 12630,
            estimatedSavings: 4200,
        })
    }),

    http.get('/api/v1/export/attendance/:tripId', ({ params }) => {
        const rows = [
            'Nome,CPF,Ponto de Embarque,Status,Método,Horário',
            'Ana Beatriz Ferreira,000456789000,Praça Central,Presente,biométrico,06:33',
            'Carlos Eduardo Lima,001456789001,Terminal Rodoviário,Presente,manual,06:35',
            'Fernanda Souza,002456789002,Bairro Novo — Escola,Ausente,,',
        ].join('\n')
        return new HttpResponse(rows, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="presenca_${params.tripId}.csv"`,
            },
        })
    }),
]

export const auditLogHandlers = [
    http.get('/api/v1/audit-logs', ({ request }) => {
        const url = new URL(request.url)
        const page = Number(url.searchParams.get('page') ?? 1)
        const limit = Number(url.searchParams.get('limit') ?? 20)

        const logs = [
            { id: 'log-001', timestamp: '2025-03-03T06:33:12Z', userId: 'user-driver-1', userName: 'Carlos Motorista', action: 'biometric_checkin_success', entityType: 'Trip', entityId: 'trip-001', metadata: { studentId: 'student-001', confidence: 0.94 } },
            { id: 'log-002', timestamp: '2025-03-03T06:35:00Z', userId: 'user-driver-1', userName: 'Carlos Motorista', action: 'manual_checkin', entityType: 'Trip', entityId: 'trip-001', metadata: { studentId: 'student-002', justification: 'Câmera sem luz suficiente' } },
            { id: 'log-003', timestamp: '2025-03-02T18:00:00Z', userId: 'user-admin-1', userName: 'Maria Silva', action: 'operation_day_published', entityType: 'OperationDay', entityId: 'opday-001', metadata: {} },
            { id: 'log-004', timestamp: '2025-03-01T14:22:00Z', userId: 'user-admin-1', userName: 'Maria Silva', action: 'student_created', entityType: 'Student', entityId: 'student-032', metadata: { name: 'Nicolas Teixeira' } },
            { id: 'log-005', timestamp: '2025-02-28T09:10:00Z', userId: 'user-op-1', userName: 'João Santos', action: 'biometric_enrolled', entityType: 'Student', entityId: 'student-004', metadata: { templateId: 'tmpl_student-004' } },
            { id: 'log-006', timestamp: '2025-02-27T16:40:00Z', userId: 'user-admin-1', userName: 'Maria Silva', action: 'vehicle_status_changed', entityType: 'Vehicle', entityId: 'veh-003', metadata: { from: 'active', to: 'maintenance' } },
        ]

        const total = logs.length
        const paginated = logs.slice((page - 1) * limit, page * limit)
        return HttpResponse.json({ data: paginated, total, page, limit })
    }),
]
