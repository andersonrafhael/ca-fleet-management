import { http, HttpResponse } from 'msw'

// Mock user DB
const users = [
    { id: 'user-admin-1', name: 'Maria Silva', email: 'admin@campoalegre.al.gov.br', role: 'admin', password: 'admin123' },
    { id: 'user-op-1', name: 'João Santos', email: 'operador@campoalegre.al.gov.br', role: 'operator', password: 'op123' },
    { id: 'user-driver-1', name: 'Carlos Motorista', email: 'motorista@campoalegre.al.gov.br', role: 'driver', password: 'driver123' },
]

export const authHandlers = [
    http.post('/api/v1/auth/login', async ({ request }) => {
        const body = await request.json() as { email: string; password: string }
        const user = users.find((u) => u.email === body.email && u.password === body.password)
        if (!user) {
            return HttpResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
        }
        const { password: _, ...safeUser } = user
        return HttpResponse.json({
            token: `mock-jwt-${user.role}-${Date.now()}`,
            user: safeUser,
        })
    }),

    http.get('/api/v1/auth/me', () => {
        return HttpResponse.json({
            id: 'user-admin-1',
            name: 'Maria Silva',
            email: 'admin@campoalegre.al.gov.br',
            role: 'admin',
        })
    }),
]
