// Central handler registry — imports are relative siblings (all in src/mocks/handlers/)
import { authHandlers } from './auth'
import { studentHandlers } from './students'
import { institutionHandlers } from './institutions'
import { boardingPointHandlers } from './boarding-points'
import { routeHandlers } from './routes'
import { vehicleHandlers } from './vehicles'
import { driverHandlers } from './drivers'
import { operationDayHandlers } from './operation-days'
import { tripHandlers } from './trips'
import { reportHandlers } from './reports'
import { auditLogHandlers } from './audit-logs'

export const handlers = [
    ...authHandlers,
    ...studentHandlers,
    ...institutionHandlers,
    ...boardingPointHandlers,
    ...routeHandlers,
    ...vehicleHandlers,
    ...driverHandlers,
    ...operationDayHandlers,
    ...tripHandlers,
    ...reportHandlers,
    ...auditLogHandlers,
]
