import { RouteGuard } from '@/lib/auth/guard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <RouteGuard>
            <AdminShell>{children}</AdminShell>
        </RouteGuard>
    )
}

// Separated so RouteGuard can pass session user eventually
function AdminShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <Topbar title="" />
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    )
}
