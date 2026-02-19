'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockLogin } from '@/lib/auth/session'
import { getDefaultPath } from '@/lib/auth/rbac'

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        const form = e.currentTarget
        const email = (form.elements.namedItem('email') as HTMLInputElement).value
        const password = (form.elements.namedItem('password') as HTMLInputElement).value

        try {
            const user = await mockLogin(email, password)
            router.replace(getDefaultPath(user.role))
        } catch {
            setError('E-mail ou senha incorretos. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#0000FF] flex items-center justify-center text-white font-black text-2xl mb-4 shadow-lg shadow-blue-500/25">
                        CA
                    </div>
                    <h1 className="text-xl font-bold text-white">Transporte Universitário</h1>
                    <p className="text-sm text-slate-400 mt-1">Prefeitura de Campo Alegre · AL</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <h2 className="text-lg font-semibold text-slate-800 mb-1">Entrar no sistema</h2>
                    <p className="text-sm text-slate-500 mb-6">Use suas credenciais institucionais</p>

                    <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                                E-mail
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                defaultValue="admin@campoalegre.al.gov.br"
                                disabled={loading}
                                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 shadow-sm
                           placeholder:text-slate-400 focus:border-[#0000FF] focus:outline-none focus:ring-2
                           focus:ring-[#0000FF]/20 disabled:opacity-60"
                                placeholder="seu@campoalegre.al.gov.br"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                defaultValue="admin123"
                                disabled={loading}
                                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 shadow-sm
                           placeholder:text-slate-400 focus:border-[#0000FF] focus:outline-none focus:ring-2
                           focus:ring-[#0000FF]/20 disabled:opacity-60"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            id="btn-login"
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-[#0000FF] px-4 py-2.5 text-sm font-semibold text-white
                         hover:bg-[#0000CC] focus:outline-none focus:ring-2 focus:ring-[#0000FF]/50 focus:ring-offset-2
                         transition-colors active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Autenticando…
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </form>

                    {/* Demo hint */}
                    <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <p className="text-xs font-medium text-slate-600 mb-1.5">Usuários de demonstração:</p>
                        <ul className="space-y-1 text-xs text-slate-500">
                            <li><span className="font-medium">Admin:</span> admin@campoalegre.al.gov.br / admin123</li>
                            <li><span className="font-medium">Operações:</span> operacoes@campoalegre.al.gov.br / ops123</li>
                            <li><span className="font-medium">Motorista:</span> motorista@campoalegre.al.gov.br / driver123</li>
                        </ul>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-500 mt-6">
                    Sistema interno · Acesso restrito a colaboradores autorizados
                </p>
            </div>
        </div>
    )
}
