/**
 * RBAC — Role-Based Access Control
 * Roles: ADMIN > OPERATIONS > DRIVER
 * No next-auth. Uses mock session from session.ts.
 */

export type Role = 'ADMIN' | 'OPERATIONS' | 'DRIVER'

export type Permission =
    // Registrations
    | 'students:read'
    | 'students:write'
    | 'students:delete'
    | 'students:enroll_biometric'
    | 'institutions:read'
    | 'institutions:write'
    | 'boarding_points:read'
    | 'boarding_points:write'
    | 'routes:read'
    | 'routes:write'
    | 'vehicles:read'
    | 'vehicles:write'
    | 'drivers:read'
    | 'drivers:write'
    // Operation
    | 'operation_days:read'
    | 'operation_days:write'
    | 'operation_days:publish'
    | 'trips:read'
    | 'trips:checkin'
    | 'trips:close'
    | 'trips:undo_checkin'  // admin only
    // Reports
    | 'reports:read'
    // Audit
    | 'audit_logs:read'

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    ADMIN: [
        'students:read', 'students:write', 'students:delete', 'students:enroll_biometric',
        'institutions:read', 'institutions:write',
        'boarding_points:read', 'boarding_points:write',
        'routes:read', 'routes:write',
        'vehicles:read', 'vehicles:write',
        'drivers:read', 'drivers:write',
        'operation_days:read', 'operation_days:write', 'operation_days:publish',
        'trips:read', 'trips:checkin', 'trips:close', 'trips:undo_checkin',
        'reports:read',
        'audit_logs:read',
    ],
    OPERATIONS: [
        'students:read', 'students:write', 'students:enroll_biometric',
        'institutions:read',
        'boarding_points:read', 'boarding_points:write',
        'routes:read', 'routes:write',
        'vehicles:read',
        'drivers:read',
        'operation_days:read', 'operation_days:write',
        'trips:read',
        'reports:read',
    ],
    DRIVER: [
        'trips:read', 'trips:checkin', 'trips:close',
    ],
}

export function hasPermission(role: Role, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function can(role: Role, ...permissions: Permission[]): boolean {
    return permissions.every((p) => hasPermission(role, p))
}

// Path → minimum required role
const ROUTE_ROLE_MAP: Array<{ pattern: RegExp; roles: Role[] }> = [
    { pattern: /^\/dashboard/, roles: ['ADMIN', 'OPERATIONS'] },
    { pattern: /^\/students/, roles: ['ADMIN', 'OPERATIONS'] },
    { pattern: /^\/institutions/, roles: ['ADMIN', 'OPERATIONS'] },
    { pattern: /^\/boarding-points/, roles: ['ADMIN', 'OPERATIONS'] },
    { pattern: /^\/routes/, roles: ['ADMIN', 'OPERATIONS'] },
    { pattern: /^\/vehicles/, roles: ['ADMIN', 'OPERATIONS'] },
    { pattern: /^\/drivers/, roles: ['ADMIN', 'OPERATIONS'] },
    { pattern: /^\/operation-days/, roles: ['ADMIN', 'OPERATIONS'] },
    { pattern: /^\/reports/, roles: ['ADMIN', 'OPERATIONS'] },
    { pattern: /^\/audit-logs/, roles: ['ADMIN'] },
    { pattern: /^\/trips/, roles: ['ADMIN', 'OPERATIONS', 'DRIVER'] },
]

export function canAccessPath(path: string, role: Role | undefined): boolean {
    if (!role) return false
    for (const { pattern, roles } of ROUTE_ROLE_MAP) {
        if (pattern.test(path)) return roles.includes(role)
    }
    return false
}

export function getDefaultPath(role: Role): string {
    switch (role) {
        case 'ADMIN':
        case 'OPERATIONS':
            return '/dashboard'
        case 'DRIVER':
            return '/trips'
    }
}
