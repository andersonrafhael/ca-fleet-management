'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, ShieldCheckIcon, ShieldXIcon, AlertTriangleIcon, Trash2Icon } from 'lucide-react'
import { StudentForm } from '@/components/forms/StudentForm'
import type { StudentFormValues } from '@/lib/schemas/student'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/schemas/student'

interface Student {
    id: string; name: string; cpf: string; email?: string; phone?: string
    course?: string; status: string; hasBiometric: boolean
    institution?: { id: string; name: string }
    boardingPoint?: { id: string; name: string }
}
interface Institution { id: string; name: string }
interface BoardingPoint { id: string; name: string }

// Next.js 16+: params is a Promise — must use React.use() to unwrap
export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [student, setStudent] = useState<Student | null>(null)
    const [institutions, setInstitutions] = useState<Institution[]>([])
    const [boardingPoints, setBoardingPoints] = useState<BoardingPoint[]>([])
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [biometryLoading, setBiometryLoading] = useState(false)
    const [biometryMsg, setBiometryMsg] = useState<string | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState(false)

    useEffect(() => {
        async function load() {
            const [stuRes, instRes, bpRes] = await Promise.all([
                fetch(`/api/v1/students/${id}`),
                fetch('/api/v1/institutions'),
                fetch('/api/v1/boarding-points'),
            ])
            if (!stuRes.ok) { router.replace('/students'); return }
            setStudent(await stuRes.json())
            setInstitutions(await instRes.json())
            setBoardingPoints(await bpRes.json())
            setLoading(false)
        }
        load()
    }, [id, router])

    async function handleUpdate(values: StudentFormValues) {
        const res = await fetch(`/api/v1/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...values, cpf: values.cpf.replace(/\D/g, '') }),
        })
        if (res.ok) {
            setStudent(await res.json())
            setEditMode(false)
        }
    }

    async function handleEnrollBiometric() {
        setBiometryLoading(true)
        setBiometryMsg(null)
        try {
            const res = await fetch(`/api/v1/students/${id}/biometric-enrollment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embedding: 'mock-embedding-base64', capturedAt: new Date().toISOString() }),
            })
            if (res.ok) {
                setStudent((s) => s ? { ...s, hasBiometric: true } : s)
                setBiometryMsg('Biometria cadastrada com sucesso!')
            }
        } finally {
            setBiometryLoading(false)
        }
    }

    async function handleRevokeBiometric() {
        setBiometryLoading(true)
        setBiometryMsg(null)
        try {
            await fetch(`/api/v1/students/${id}/biometric-enrollment`, { method: 'DELETE' })
            setStudent((s) => s ? { ...s, hasBiometric: false } : s)
            setBiometryMsg('Biometria revogada.')
        } finally {
            setBiometryLoading(false)
        }
    }

    async function handleDelete() {
        await fetch(`/api/v1/students/${id}`, { method: 'DELETE' })
        router.push('/students')
    }

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0000FF] border-t-transparent" />
        </div>
    )
    if (!student) return null

    return (
        <div className="max-w-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/students" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors">
                        <ArrowLeftIcon className="h-4 w-4" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{student.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[student.status]}`}>
                                {STATUS_LABELS[student.status]}
                            </span>
                            {student.hasBiometric
                                ? <span className="inline-flex items-center gap-1 text-xs text-green-600"><ShieldCheckIcon className="h-3 w-3" /> Biometria cadastrada</span>
                                : <span className="inline-flex items-center gap-1 text-xs text-slate-400"><ShieldXIcon className="h-3 w-3" /> Sem biometria</span>
                            }
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setDeleteConfirm(true)}
                    className="rounded-lg p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Desativar aluno"
                >
                    <Trash2Icon className="h-4 w-4" />
                </button>
            </div>

            {/* Delete confirm */}
            {deleteConfirm && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                    <AlertTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-red-700">Desativar este aluno?</p>
                        <p className="text-xs text-red-500 mt-0.5">O aluno será marcado como inativo e não poderá embarcar.</p>
                        <div className="flex gap-2 mt-3">
                            <button onClick={handleDelete} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">Confirmar</button>
                            <button onClick={() => setDeleteConfirm(false)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-white">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Form / Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                {editMode ? (
                    <StudentForm
                        defaultValues={{
                            name: student.name, cpf: student.cpf, email: student.email, phone: student.phone,
                            course: student.course, status: student.status as never,
                            institutionId: student.institution?.id, boardingPointId: student.boardingPoint?.id,
                        }}
                        institutions={institutions}
                        boardingPoints={boardingPoints}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditMode(false)}
                        isEdit
                    />
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            {[
                                ['CPF', student.cpf ? `${student.cpf.slice(0, 3)}.${student.cpf.slice(3, 6)}.${student.cpf.slice(6, 9)}-${student.cpf.slice(9)}` : '—'],
                                ['E-mail', student.email || '—'],
                                ['Telefone', student.phone || '—'],
                                ['Curso', student.course || '—'],
                                ['Instituição', student.institution?.name || '—'],
                                ['Embarque', student.boardingPoint?.name || '—'],
                            ].map(([label, value]) => (
                                <div key={label}>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
                                    <p className="mt-0.5 text-slate-800">{value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex justify-end">
                            <button onClick={() => setEditMode(true)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                Editar dados
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Biometrics card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-700 mb-1">Biometria facial</h3>
                <p className="text-xs text-slate-500 mb-4">
                    {student.hasBiometric
                        ? 'Template biométrico cadastrado. O aluno pode usar check-in biométrico.'
                        : 'Nenhum template cadastrado. Cadastre a biometria para habilitar check-in facial.'}
                </p>
                {biometryMsg && (
                    <p className="mb-3 text-sm font-medium text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">{biometryMsg}</p>
                )}
                <div className="flex gap-2">
                    {!student.hasBiometric ? (
                        <button
                            onClick={handleEnrollBiometric}
                            disabled={biometryLoading}
                            className="rounded-lg bg-[#00AA44] px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60 transition-colors flex items-center gap-2"
                        >
                            {biometryLoading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                            {biometryLoading ? 'Processando…' : 'Cadastrar biometria'}
                        </button>
                    ) : (
                        <button
                            onClick={handleRevokeBiometric}
                            disabled={biometryLoading}
                            className="rounded-lg border border-red-300 text-red-600 px-4 py-2 text-sm font-medium hover:bg-red-50 disabled:opacity-60 transition-colors"
                        >
                            {biometryLoading ? 'Revogando…' : 'Revogar biometria'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
