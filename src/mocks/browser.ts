// MSW browser setup — used in Next.js app (dev only)
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
