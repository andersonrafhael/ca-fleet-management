/**
 * Auth Mock-First — Session management via cookies
 * No next-auth. Cookie-based session with 2 seed users for MVP validation.
 * Replace with real JWT/SSO in production.
 */

export type Role = 'ADMIN' | 'OPERATIONS' | 'DRIVER'

export interface SessionUser {
    id: string
    name: string
    email: string
    role: Role
}

// ── Seed users (dev only) ──────────────────────────────────────────
export const SEED_USERS: Array<SessionUser & { password: string }> = [
    {
        id: 'user-admin-1',
        name: 'Maria Silva',
        email: 'admin@campoalegre.al.gov.br',
        role: 'ADMIN',
        password: 'admin123',
    },
    {
        id: 'user-ops-1',
        name: 'João Santos',
        email: 'operacoes@campoalegre.al.gov.br',
        role: 'OPERATIONS',
        password: 'ops123',
    },
    {
        id: 'user-driver-1',
        name: 'Carlos Motorista',
        email: 'motorista@campoalegre.al.gov.br',
        role: 'DRIVER',
        password: 'driver123',
    },
]

const SESSION_COOKIE = 'ca_session'

// ── Cookie-based session helpers (client-side, localStorage fallback) ──
export function setSession(user: SessionUser): void {
    if (typeof window === 'undefined') return
    const payload = JSON.stringify(user)
    // In production: httpOnly cookie set by server. In mock: localStorage.
    localStorage.setItem(SESSION_COOKIE, payload)
}

export function getSession(): SessionUser | null {
    if (typeof window === 'undefined') return null
    try {
        const raw = localStorage.getItem(SESSION_COOKIE)
        if (!raw) return null
        return JSON.parse(raw) as SessionUser
    } catch {
        return null
    }
}

export function clearSession(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(SESSION_COOKIE)
}

/**
 * Mock login — validates against seed users.
 * In production: POST /auth/login → JWT → httpOnly cookie.
 */
export async function mockLogin(email: string, password: string): Promise<SessionUser> {
    await new Promise((r) => setTimeout(r, 600)) // simulate API latency
    const user = SEED_USERS.find((u) => u.email === email && u.password === password)
    if (!user) throw new Error('Credenciais inválidas')
    const { password: _, ...sessionUser } = user
    setSession(sessionUser)
    return sessionUser
}
