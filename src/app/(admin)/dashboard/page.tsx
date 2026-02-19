import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Painel',
}

// KPI card data — mocked (will come from /api/v1/reports/* in production)
const KPI = [
    { label: 'Viagens Hoje', value: '3', sub: '2 concluídas · 1 ativa', color: 'bg-[#0000FF]' },
    { label: 'Alunos Ativos', value: '32', sub: '28 com biometria cadastrada', color: 'bg-[#00AA44]' },
    { label: 'Ocupação Média', value: '73%', sub: 'Meta: ≥ 80%', color: 'bg-[#EE6600]', warn: true },
    { label: 'Viagens c/ Baixa Ocupação', value: '18', sub: 'Este mês · < 50%', color: 'bg-[#DD1111]', warn: true },
]

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Painel Operacional</h2>
                <p className="text-sm text-slate-500 mt-1">
                    Prefeitura de Campo Alegre · Transporte Universitário · {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {KPI.map((kpi) => (
                    <div
                        key={kpi.label}
                        className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${kpi.color} text-white`}>
                            <span className="text-lg font-bold">{kpi.value[0]}</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
                            <p className="text-sm font-medium text-slate-600">{kpi.label}</p>
                            <p className={`text-xs mt-0.5 ${kpi.warn ? 'text-orange-500 font-medium' : 'text-slate-400'}`}>{kpi.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="font-semibold text-slate-700 mb-3">Ações Rápidas</h3>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { label: '+ Novo Aluno', href: '/students/new' },
                            { label: '+ Dia de Operação', href: '/operation-days' },
                            { label: 'Ver Relatório de Ocupação', href: '/reports/occupation' },
                            { label: 'Logs de Auditoria', href: '/audit-logs' },
                        ].map((action) => (
                            <a
                                key={action.href}
                                href={action.href}
                                className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-[#0000FF] hover:text-white hover:border-[#0000FF] transition-colors"
                            >
                                {action.label}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="font-semibold text-slate-700 mb-3">Viagens de Hoje</h3>
                    <div className="space-y-2">
                        {[
                            { route: 'Campo Alegre → UFAL (IDA)', time: '06:30', status: 'Concluída', statusColor: 'text-green-600' },
                            { route: 'Campo Alegre → CESMAC (IDA)', time: '06:45', status: 'Concluída', statusColor: 'text-green-600' },
                            { route: 'UFAL → Campo Alegre (VOLTA)', time: '18:00', status: 'Planejada', statusColor: 'text-slate-500' },
                        ].map((trip) => (
                            <div key={trip.route} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">{trip.route}</p>
                                    <p className="text-xs text-slate-400">{trip.time}</p>
                                </div>
                                <span className={`text-xs font-medium ${trip.statusColor}`}>{trip.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
