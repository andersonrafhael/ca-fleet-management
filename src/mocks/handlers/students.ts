import { http, HttpResponse } from 'msw'

// ── Seed data ──────────────────────────────────────────────────────────────────
const INSTITUTIONS = [
    { id: 'inst-001', name: 'UFAL — Universidade Federal de Alagoas', city: 'Maceió', active: true },
    { id: 'inst-002', name: 'CESMAC — Centro Universitário', city: 'Maceió', active: true },
    { id: 'inst-003', name: 'Estácio Maceió', city: 'Maceió', active: true },
]

const BOARDING_POINTS = [
    { id: 'bp-001', name: 'Praça Central', address: 'Praça Dom Pedro II, Centro', reference: 'Em frente à Prefeitura' },
    { id: 'bp-002', name: 'Terminal Rodoviário', address: 'Av. Siqueira Campos, s/n', reference: 'Entrada principal' },
    { id: 'bp-003', name: 'Bairro Novo — Escola', address: 'Rua das Flores, 120, Bairro Novo', reference: 'Ao lado da escola municipal' },
]

// Deterministic student seed
const STUDENTS = Array.from({ length: 32 }, (_, i) => ({
    id: `student-${String(i + 1).padStart(3, '0')}`,
    name: [
        'Ana Beatriz Ferreira', 'Carlos Eduardo Lima', 'Fernanda Souza', 'Gabriel Alves', 'Isadora Mendes',
        'João Pedro Nunes', 'Larissa Costa', 'Mateus Rodrigues', 'Natália Pinto', 'Otávio Barbosa',
        'Priscila Cavalcante', 'Rafael Moreira', 'Sabrina Vieira', 'Thiago Santos', 'Vanessa Carvalho',
        'Willian Oliveira', 'Ximena Torres', 'Yasmin Albuquerque', 'Zeca Nascimento', 'Amanda Freitas',
        'Bruno Monteiro', 'Camila Lopes', 'Diego Pereira', 'Elisa Martins', 'Felipe Corrêa',
        'Giovana Ribeiro', 'Henrique Azevedo', 'Iris Melo', 'Júlia Cunha', 'Leandro Barros',
        'Mariana Gomes', 'Nicolas Teixeira',
    ][i],
    cpf: `${String(i + 1).padStart(3, '0')}456789${String(i).padStart(2, '0')}`,
    course: ['Medicina', 'Engenharia Civil', 'Direito', 'Enfermagem', 'Administração', 'Pedagogia'][i % 6],
    status: i % 7 === 0 ? 'inactive' : 'active',
    institutionId: INSTITUTIONS[i % 3].id,
    institution: INSTITUTIONS[i % 3],
    boardingPointId: BOARDING_POINTS[i % 3].id,
    boardingPoint: BOARDING_POINTS[i % 3],
    hasBiometric: i % 3 === 0,
    phone: `(82) 9${String(Math.floor(i * 1374 + 8000)).slice(0, 4)}-${String(Math.floor(i * 9281 + 1000)).slice(0, 4)}`,
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-15T14:30:00Z',
}))

// In-memory mutable store
let students = [...STUDENTS]

function paginate<T>(arr: T[], page: number, limit: number) {
    return { data: arr.slice((page - 1) * limit, page * limit), total: arr.length, page, limit }
}

export const studentHandlers = [
    // LIST
    http.get('/api/v1/students', ({ request }) => {
        const url = new URL(request.url)
        const page = Number(url.searchParams.get('page') ?? 1)
        const limit = Number(url.searchParams.get('limit') ?? 20)
        const q = url.searchParams.get('q') ?? ''
        const status = url.searchParams.get('status')
        const institutionId = url.searchParams.get('institutionId')

        let filtered = students
        if (q) filtered = filtered.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.cpf.includes(q))
        if (status) filtered = filtered.filter((s) => s.status === status)
        if (institutionId) filtered = filtered.filter((s) => s.institutionId === institutionId)

        return HttpResponse.json(paginate(filtered, page, limit))
    }),

    // GET ONE
    http.get('/api/v1/students/:id', ({ params }) => {
        const student = students.find((s) => s.id === params.id)
        if (!student) return HttpResponse.json({ message: 'Aluno não encontrado' }, { status: 404 })
        return HttpResponse.json(student)
    }),

    // CREATE
    http.post('/api/v1/students', async ({ request }) => {
        const body = await request.json() as Partial<typeof students[0]>
        if (students.some((s) => s.cpf === body.cpf)) {
            return HttpResponse.json({ message: 'CPF já cadastrado', errors: { cpf: ['CPF em uso'] } }, { status: 422 })
        }
        const institution = INSTITUTIONS.find((i) => i.id === body.institutionId)
        const boardingPoint = BOARDING_POINTS.find((b) => b.id === body.boardingPointId)
        const newStudent = {
            ...body,
            id: `student-${Date.now()}`,
            status: body.status ?? 'active',
            hasBiometric: false,
            institution,
            boardingPoint,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as typeof students[0]
        students.push(newStudent)
        return HttpResponse.json(newStudent, { status: 201 })
    }),

    // UPDATE
    http.put('/api/v1/students/:id', async ({ params, request }) => {
        const idx = students.findIndex((s) => s.id === params.id)
        if (idx === -1) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
        const body = await request.json() as Partial<typeof students[0]>
        const institution = INSTITUTIONS.find((i) => i.id === body.institutionId)
        const boardingPoint = BOARDING_POINTS.find((b) => b.id === body.boardingPointId)
        students[idx] = { ...students[idx], ...body, institution, boardingPoint, updatedAt: new Date().toISOString() }
        return HttpResponse.json(students[idx])
    }),

    // DELETE (soft)
    http.delete('/api/v1/students/:id', ({ params }) => {
        const idx = students.findIndex((s) => s.id === params.id)
        if (idx === -1) return HttpResponse.json({ message: 'Não encontrado' }, { status: 404 })
        students[idx] = { ...students[idx], status: 'inactive' }
        return new HttpResponse(null, { status: 204 })
    }),

    // BIOMETRIC ENROLLMENT
    http.post('/api/v1/students/:id/biometric-enrollment', async ({ params }) => {
        await new Promise((r) => setTimeout(r, 1500)) // simulate processing
        const idx = students.findIndex((s) => s.id === params.id)
        if (idx !== -1) students[idx] = { ...students[idx], hasBiometric: true }
        return HttpResponse.json({
            templateId: `tmpl_${params.id}_${Date.now()}`,
            enrolledAt: new Date().toISOString(),
        }, { status: 201 })
    }),

    http.delete('/api/v1/students/:id/biometric-enrollment', ({ params }) => {
        const idx = students.findIndex((s) => s.id === params.id)
        if (idx !== -1) students[idx] = { ...students[idx], hasBiometric: false }
        return new HttpResponse(null, { status: 204 })
    }),
]

export { INSTITUTIONS, BOARDING_POINTS, STUDENTS }
