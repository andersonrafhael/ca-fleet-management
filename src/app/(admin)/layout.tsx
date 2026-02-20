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
        <div className="flex h-screen overflow-hidden bg-[#F6F8FA]">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
                    <div className="max-w-[1400px] mx-auto animate-[fade-in_0.3s_ease-out]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
