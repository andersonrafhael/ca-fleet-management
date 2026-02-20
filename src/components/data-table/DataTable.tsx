'use client'

import * as React from 'react'
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
} from '@tanstack/react-table'
import {
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    ChevronLeft,
    ChevronRight,
    SearchIcon,
    InboxIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DataTableProps<TData> {
    data: TData[]
    columns: ColumnDef<TData>[]
    loading?: boolean
    searchColumn?: string
    searchPlaceholder?: string
    pageSize?: number
}

export function DataTable<TData>({
    data,
    columns,
    loading = false,
    searchColumn,
    searchPlaceholder = 'Buscar…',
    pageSize = 15,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        initialState: { pagination: { pageSize } },
        state: { sorting, columnFilters },
    })

    const searchValue = searchColumn
        ? (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''
        : ''

    const pageCount = table.getPageCount()
    const currentPage = table.getState().pagination.pageIndex
    const totalRows = table.getFilteredRowModel().rows.length

    return (
        <div className="space-y-3">
            {/* Search */}
            {searchColumn && (
                <div className="relative w-full max-w-sm">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                        value={searchValue}
                        onChange={(e) => table.getColumn(searchColumn)?.setFilterValue(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm text-slate-700
                         placeholder:text-slate-400
                         focus:border-[#0000FF] focus:outline-none focus:ring-2 focus:ring-[#0000FF]/10
                         transition-all duration-200"
                    />
                </div>
            )}

            {/* Table */}
            <div className="rounded-xl border border-slate-200/80 overflow-hidden bg-white shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            {table.getHeaderGroups().map((hg) => (
                                <tr key={hg.id} className="border-b border-slate-200/80 bg-slate-50/60">
                                    {hg.headers.map((header) => {
                                        const canSort = header.column.getCanSort()
                                        const sorted = header.column.getIsSorted()
                                        return (
                                            <th
                                                key={header.id}
                                                className={cn(
                                                    'px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap',
                                                    canSort && 'cursor-pointer select-none hover:text-slate-700 transition-colors'
                                                )}
                                                onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                                            >
                                                <span className="inline-flex items-center gap-1">
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                    {canSort && (
                                                        <span className={cn('transition-colors', sorted ? 'text-[#0000FF]' : 'text-slate-300')}>
                                                            {sorted === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> :
                                                                sorted === 'desc' ? <ChevronDown className="h-3.5 w-3.5" /> :
                                                                    <ChevronsUpDown className="h-3 w-3" />}
                                                        </span>
                                                    )}
                                                </span>
                                            </th>
                                        )
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="border-b border-slate-100/80 last:border-0">
                                        {columns.map((_, j) => (
                                            <td key={j} className="px-4 py-3.5">
                                                <div
                                                    className="h-4 bg-slate-100 rounded-md animate-pulse"
                                                    style={{ width: `${50 + Math.random() * 40}%`, animationDelay: `${i * 80 + j * 30}ms` }}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-4 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
                                                <InboxIcon className="h-6 w-6 text-slate-300" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-500">Nenhum resultado encontrado</p>
                                            <p className="text-xs text-slate-400">Tente ajustar os filtros ou a busca</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row, i) => (
                                    <tr
                                        key={row.id}
                                        className={cn(
                                            'border-b border-slate-100/80 last:border-0',
                                            'hover:bg-[#0000FF]/[0.015] transition-colors duration-150',
                                            i % 2 === 1 && 'bg-slate-50/30'
                                        )}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-4 py-3 text-slate-700">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
                <div className="flex items-center justify-between text-sm">
                    <span className="text-xs text-slate-400">
                        {totalRows} registro{totalRows !== 1 ? 's' : ''} · Página {currentPage + 1} de {pageCount}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            aria-label="Página anterior"
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700
                             disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        {/* Page numbers */}
                        {getVisiblePages(currentPage, pageCount).map((page, i) =>
                            page === '...' ? (
                                <span key={`dots-${i}`} className="px-1 text-slate-300 text-xs">…</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => table.setPageIndex(page as number)}
                                    className={cn(
                                        'h-8 min-w-[32px] rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer',
                                        page === currentPage
                                            ? 'bg-[#0000FF] text-white shadow-sm shadow-blue-500/20'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                    )}
                                >
                                    {(page as number) + 1}
                                </button>
                            )
                        )}

                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            aria-label="Próxima página"
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700
                             disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ─── Pagination helpers ────────────────────────────────────────── */
function getVisiblePages(current: number, total: number): (number | string)[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i)

    const pages: (number | string)[] = []
    const addPage = (p: number) => {
        if (!pages.includes(p) && p >= 0 && p < total) pages.push(p)
    }

    addPage(0)
    if (current > 2) pages.push('...')
    for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) addPage(i)
    if (current < total - 3) pages.push('...')
    addPage(total - 1)

    return pages
}
