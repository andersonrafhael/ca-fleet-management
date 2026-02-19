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
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
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

    return (
        <div className="space-y-3">
            {/* Search */}
            {searchColumn && (
                <input
                    value={searchValue}
                    onChange={(e) => table.getColumn(searchColumn)?.setFilterValue(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full max-w-xs rounded-lg border border-slate-300 px-3.5 py-2 text-sm
                     focus:border-[#0000FF] focus:outline-none focus:ring-2 focus:ring-[#0000FF]/20"
                />
            )}

            {/* Table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id}>
                                {hg.headers.map((header) => {
                                    const canSort = header.column.getCanSort()
                                    const sorted = header.column.getIsSorted()
                                    return (
                                        <th
                                            key={header.id}
                                            className={cn(
                                                'px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap',
                                                canSort && 'cursor-pointer select-none hover:text-slate-700'
                                            )}
                                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                                        >
                                            <span className="inline-flex items-center gap-1">
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                {canSort && (
                                                    <span className="text-slate-300">
                                                        {sorted === 'asc' ? <ChevronUp className="h-3 w-3" /> :
                                                            sorted === 'desc' ? <ChevronDown className="h-3 w-3" /> :
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
                                <tr key={i} className="border-b border-slate-100 last:border-0">
                                    {columns.map((_, j) => (
                                        <td key={j} className="px-4 py-3">
                                            <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400 text-sm">
                                    Nenhum resultado encontrado.
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
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

            {/* Pagination */}
            {table.getPageCount() > 1 && (
                <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>
                        {table.getFilteredRowModel().rows.length} registro(s) ·{' '}
                        Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
