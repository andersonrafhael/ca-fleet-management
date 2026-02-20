'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { mockLogin } from '@/lib/auth/session'
import { getDefaultPath } from '@/lib/auth/rbac'
import { LockKeyholeIcon, MailIcon, AlertCircleIcon } from 'lucide-react'

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
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A2E] via-[#0F172A] to-[#0A1628]" />

            {/* Decorative blobs */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#0000FF]/[0.07] blur-[120px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#0099DD]/[0.06] blur-[100px]" />
            <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-[#00AA44]/[0.04] blur-[80px]" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-[420px] animate-[scale-in_0.4s_ease-out]">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] flex items-center justify-center mb-5 shadow-2xl shadow-blue-500/10">
                        <Image
                            src="/brand/heart-logo.svg"
                            alt="Campo Alegre"
                            width={52}
                            height={52}
                            className="object-contain drop-shadow-lg"
                            priority
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Transporte Universitário
                    </h1>
                    <p className="text-sm text-slate-400 mt-1.5">
                        Prefeitura de Campo Alegre · AL
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.1] rounded-2xl p-7 shadow-2xl shadow-black/20">
                    <h2 className="text-lg font-semibold text-white mb-0.5">Entrar no sistema</h2>
                    <p className="text-sm text-slate-400 mb-6">Use suas credenciais institucionais</p>

                    <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                                E-mail
                            </label>
                            <div className="relative">
                                <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    defaultValue="admin@campoalegre.al.gov.br"
                                    disabled={loading}
                                    placeholder="seu@campoalegre.al.gov.br"
                                    className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] pl-11 pr-4 py-2.5 text-sm text-white
                                     placeholder:text-slate-500 focus:border-[#0099DD]/50 focus:outline-none focus:ring-2
                                     focus:ring-[#0099DD]/20 focus:bg-white/[0.08] disabled:opacity-60 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Senha
                            </label>
                            <div className="relative">
                                <LockKeyholeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    defaultValue="admin123"
                                    disabled={loading}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] pl-11 pr-4 py-2.5 text-sm text-white
                                     placeholder:text-slate-500 focus:border-[#0099DD]/50 focus:outline-none focus:ring-2
                                     focus:ring-[#0099DD]/20 focus:bg-white/[0.08] disabled:opacity-60 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                role="alert"
                                aria-live="assertive"
                                className="flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-2.5 animate-[slide-up_0.2s_ease-out]"
                            >
                                <AlertCircleIcon className="h-4 w-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            id="btn-login"
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white cursor-pointer
                             bg-gradient-to-r from-[#0000FF] to-[#0055EE]
                             hover:from-[#0000DD] hover:to-[#0044DD]
                             focus:outline-none focus:ring-2 focus:ring-[#0099DD]/50 focus:ring-offset-2 focus:ring-offset-[#0F172A]
                             transition-all duration-200 active:scale-[0.98]
                             disabled:opacity-60 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2
                             shadow-lg shadow-blue-600/25"
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
                    <div className="mt-6 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                        <p className="text-xs font-medium text-slate-400 mb-2">Usuários de demonstração:</p>
                        <ul className="space-y-1.5 text-xs text-slate-500">
                            <li><span className="font-medium text-slate-400">Admin:</span> admin@campoalegre.al.gov.br / admin123</li>
                            <li><span className="font-medium text-slate-400">Operações:</span> operacoes@campoalegre.al.gov.br / ops123</li>
                            <li><span className="font-medium text-slate-400">Motorista:</span> motorista@campoalegre.al.gov.br / driver123</li>
                        </ul>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-600 mt-6">
                    Sistema interno · Acesso restrito a colaboradores autorizados
                </p>
            </div>
        </div>
    )
}
