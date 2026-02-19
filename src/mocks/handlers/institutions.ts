import { http, HttpResponse } from 'msw'
import { INSTITUTIONS, BOARDING_POINTS } from './students'

// Vehicles
const VEHICLES = [
    { id: 'veh-001', licensePlate: 'ABC-1234', model: 'OF-1721', brand: 'Marcopolo', year: 2019, capacity: 42, type: 'bus', status: 'active', currentKm: 87432 },
    { id: 'veh-002', licensePlate: 'DEF-5678', model: 'Unity', brand: 'Volare', year: 2021, capacity: 28, type: 'minibus', status: 'active', currentKm: 43210 },
    { id: 'veh-003', licensePlate: 'GHI-9012', model: 'Sprinter 415', brand: 'Mercedes-Benz', year: 2020, capacity: 15, type: 'van', status: 'maintenance', currentKm: 102890 },
    { id: 'veh-004', licensePlate: 'JKL-3456', model: 'OF-1315', brand: 'Marcopolo', year: 2018, capacity: 35, type: 'bus', status: 'active', currentKm: 156780 },
]

// Drivers
const DRIVERS = [
    { id: 'drv-001', name: 'José Ferreira da Silva', cpf: '12345678901', cnh: 'CNH12345', cnhCategory: 'D', phone: '(82) 99876-5432', status: 'active' },
    { id: 'drv-002', name: 'Antônio Carlos Pereira', cpf: '98765432100', cnh: 'CNH98765', cnhCategory: 'D', phone: '(82) 98765-4321', status: 'active' },
    { id: 'drv-003', name: 'Pedro Alves Nascimento', cpf: '11122233344', cnh: 'CNH11122', cnhCategory: 'E', phone: '(82) 97654-3210', status: 'active' },
]

// Routes
const ROUTES = [
    { id: 'route-001', name: 'Campo Alegre → UFAL (IDA)', description: 'Saída de Campo Alegre às 6h30', direction: 'going', departureTime: '06:30', active: true, boardingPointIds: ['bp-001', 'bp-002', 'bp-003'], boardingPoints: [BOARDING_POINTS[0], BOARDING_POINTS[1], BOARDING_POINTS[2]] },
    { id: 'route-002', name: 'UFAL → Campo Alegre (VOLTA)', description: 'Retorno saindo de Maceió às 18h00', direction: 'returning', departureTime: '18:00', active: true, boardingPointIds: ['bp-002', 'bp-001'], boardingPoints: [BOARDING_POINTS[1], BOARDING_POINTS[0]] },
    { id: 'route-003', name: 'Campo Alegre → CESMAC (IDA)', description: 'Rota alternativa para CESMAC', direction: 'going', departureTime: '06:45', active: true, boardingPointIds: ['bp-001', 'bp-003'], boardingPoints: [BOARDING_POINTS[0], BOARDING_POINTS[2]] },
]

export const institutionHandlers = [
    http.get('/api/v1/institutions', () => HttpResponse.json(INSTITUTIONS)),
    http.get('/api/v1/institutions/:id', ({ params }) => {
        const inst = INSTITUTIONS.find((i) => i.id === params.id)
        return inst ? HttpResponse.json(inst) : HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
    }),
    http.post('/api/v1/institutions', async ({ request }) => {
        const body = await request.json() as { name: string; city?: string }
        const item = { id: `inst-${Date.now()}`, ...body, active: true }
        INSTITUTIONS.push(item as typeof INSTITUTIONS[0])
        return HttpResponse.json(item, { status: 201 })
    }),
    http.put('/api/v1/institutions/:id', async ({ params, request }) => {
        const body = await request.json() as Partial<typeof INSTITUTIONS[0]>
        const idx = INSTITUTIONS.findIndex((i) => i.id === params.id)
        if (idx === -1) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
        Object.assign(INSTITUTIONS[idx], body)
        return HttpResponse.json(INSTITUTIONS[idx])
    }),
    http.delete('/api/v1/institutions/:id', ({ params }) => {
        const idx = INSTITUTIONS.findIndex((i) => i.id === params.id)
        if (idx !== -1) INSTITUTIONS.splice(idx, 1)
        return new HttpResponse(null, { status: 204 })
    }),
]

export const boardingPointHandlers = [
    http.get('/api/v1/boarding-points', () => HttpResponse.json(BOARDING_POINTS)),
    http.get('/api/v1/boarding-points/:id', ({ params }) => {
        const bp = BOARDING_POINTS.find((b) => b.id === params.id)
        return bp ? HttpResponse.json(bp) : HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
    }),
    http.post('/api/v1/boarding-points', async ({ request }) => {
        const body = await request.json() as { name: string }
        const item = { id: `bp-${Date.now()}`, ...body }
        BOARDING_POINTS.push(item as typeof BOARDING_POINTS[0])
        return HttpResponse.json(item, { status: 201 })
    }),
    http.put('/api/v1/boarding-points/:id', async ({ params, request }) => {
        const body = await request.json() as Partial<typeof BOARDING_POINTS[0]>
        const idx = BOARDING_POINTS.findIndex((b) => b.id === params.id)
        if (idx === -1) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
        Object.assign(BOARDING_POINTS[idx], body)
        return HttpResponse.json(BOARDING_POINTS[idx])
    }),
    http.delete('/api/v1/boarding-points/:id', ({ params }) => {
        const idx = BOARDING_POINTS.findIndex((b) => b.id === params.id)
        if (idx !== -1) BOARDING_POINTS.splice(idx, 1)
        return new HttpResponse(null, { status: 204 })
    }),
]

export const routeHandlers = [
    http.get('/api/v1/routes', () => HttpResponse.json(ROUTES)),
    http.get('/api/v1/routes/:id', ({ params }) => {
        const r = ROUTES.find((r) => r.id === params.id)
        return r ? HttpResponse.json(r) : HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
    }),
    http.post('/api/v1/routes', async ({ request }) => {
        const body = await request.json() as { name: string; direction: string; boardingPointIds?: string[] }
        const bps = (body.boardingPointIds ?? []).map((id) => BOARDING_POINTS.find((b) => b.id === id)).filter(Boolean)
        const item = { id: `route-${Date.now()}`, ...body, active: true, boardingPoints: bps }
        ROUTES.push(item as typeof ROUTES[0])
        return HttpResponse.json(item, { status: 201 })
    }),
    http.put('/api/v1/routes/:id', async ({ params, request }) => {
        const body = await request.json() as Partial<typeof ROUTES[0]>
        const idx = ROUTES.findIndex((r) => r.id === params.id)
        if (idx === -1) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
        Object.assign(ROUTES[idx], body)
        return HttpResponse.json(ROUTES[idx])
    }),
    http.delete('/api/v1/routes/:id', ({ params }) => {
        const idx = ROUTES.findIndex((r) => r.id === params.id)
        if (idx !== -1) ROUTES.splice(idx, 1)
        return new HttpResponse(null, { status: 204 })
    }),
]

export const vehicleHandlers = [
    http.get('/api/v1/vehicles', () => HttpResponse.json(VEHICLES)),
    http.get('/api/v1/vehicles/:id', ({ params }) => {
        const v = VEHICLES.find((v) => v.id === params.id)
        return v ? HttpResponse.json(v) : HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
    }),
    http.post('/api/v1/vehicles', async ({ request }) => {
        const body = await request.json() as Partial<typeof VEHICLES[0]>
        const item = { id: `veh-${Date.now()}`, status: 'active', ...body } as typeof VEHICLES[0]
        VEHICLES.push(item)
        return HttpResponse.json(item, { status: 201 })
    }),
    http.put('/api/v1/vehicles/:id', async ({ params, request }) => {
        const body = await request.json() as Partial<typeof VEHICLES[0]>
        const idx = VEHICLES.findIndex((v) => v.id === params.id)
        if (idx === -1) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
        Object.assign(VEHICLES[idx], body)
        return HttpResponse.json(VEHICLES[idx])
    }),
    http.delete('/api/v1/vehicles/:id', ({ params }) => {
        const idx = VEHICLES.findIndex((v) => v.id === params.id)
        if (idx !== -1) VEHICLES[idx].status = 'inactive'
        return new HttpResponse(null, { status: 204 })
    }),
]

export const driverHandlers = [
    http.get('/api/v1/drivers', () => HttpResponse.json(DRIVERS)),
    http.get('/api/v1/drivers/:id', ({ params }) => {
        const d = DRIVERS.find((d) => d.id === params.id)
        return d ? HttpResponse.json(d) : HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
    }),
    http.post('/api/v1/drivers', async ({ request }) => {
        const body = await request.json() as Partial<typeof DRIVERS[0]>
        const item = { id: `drv-${Date.now()}`, status: 'active', ...body } as typeof DRIVERS[0]
        DRIVERS.push(item)
        return HttpResponse.json(item, { status: 201 })
    }),
    http.put('/api/v1/drivers/:id', async ({ params, request }) => {
        const body = await request.json() as Partial<typeof DRIVERS[0]>
        const idx = DRIVERS.findIndex((d) => d.id === params.id)
        if (idx === -1) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
        Object.assign(DRIVERS[idx], body)
        return HttpResponse.json(DRIVERS[idx])
    }),
    http.delete('/api/v1/drivers/:id', ({ params }) => {
        const idx = DRIVERS.findIndex((d) => d.id === params.id)
        if (idx !== -1) DRIVERS[idx].status = 'inactive'
        return new HttpResponse(null, { status: 204 })
    }),
]

export { VEHICLES, DRIVERS, ROUTES }
