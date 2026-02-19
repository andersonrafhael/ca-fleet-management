// RBAC types and guard utilities
export type Role = 'admin' | 'operator' | 'driver'

export interface RBACRule {
    roles: Role[]
}

// Resource → allowed roles
export const RBAC: Record<string, Role[]> = {
    // CRUDs
    '/dashboard': ['admin', 'operator'],
    '/students': ['admin', 'operator'],
    '/institutions': ['admin', 'operator'],
    '/boarding-points': ['admin', 'operator'],
    '/routes': ['admin', 'operator'],
    '/vehicles': ['admin', 'operator'],
    '/drivers': ['admin', 'operator'],
    '/calendars': ['admin'],
    '/operation-days': ['admin', 'operator'],
    '/reports': ['admin', 'operator'],
    '/audit-logs': ['admin'],
    // Operation mode
    '/trips': ['admin', 'operator', 'driver'],
}

export function canAccess(path: string, role: Role | undefined): boolean {
    if (!role) return false
    // Find the most specific matching rule
    const keys = Object.keys(RBAC).sort((a, b) => b.length - a.length)
    for (const key of keys) {
        if (path.startsWith(key)) {
            return RBAC[key].includes(role)
        }
    }
    return false
}

export function getDefaultRedirect(role: Role): string {
    switch (role) {
        case 'admin':
        case 'operator':
            return '/dashboard'
        case 'driver':
            return '/trips'
        default:
            return '/login'
    }
}
