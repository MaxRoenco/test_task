"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    canNextPage: boolean
    canPrevPage: boolean
    totalPages: number
    pageNumber: number
}

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"
import Link from "next/link"

export function DataTable<TData, TValue>({
    columns,
    data,
    canNextPage,
    canPrevPage,
    totalPages,
    pageNumber,
}: DataTableProps<TData, TValue>) {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        defaultColumn: {
            size: 200, //starting column size
            minSize: 50, //enforced during column resizing
            maxSize: 500, //enforced during column resizing
        },
    })

    return (
        <div className="mx-10">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter statuses..."
                    value={(table.getColumn("subject")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("subject")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter(
                                (column) => column.getCanHide()
                            )
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                {canPrevPage && <Link href={`/tickets?page=1`}>
                    <Button
                        variant="outline"
                        size="sm"
                    >
                        First
                    </Button>
                </Link>}
                {canPrevPage && <Link href={`/tickets?page=${pageNumber - 1}`}>
                    <Button
                        variant="outline"
                        size="sm"
                    >
                        Previous
                    </Button>
                </Link>}
                <p className="mr-1 text-gray-500">{`Page ${pageNumber} out of ${totalPages}`}</p>
                {canNextPage && <Link href={`/tickets?page=${pageNumber + 1}`}>
                    <Button
                        variant="outline"
                        size="sm"
                    >
                        Next
                    </Button>
                </Link>}
                {canNextPage && <Link href={`/tickets?page=${totalPages}`}>
                    <Button
                        variant="outline"
                        size="sm"
                    >
                        Last
                    </Button>
                </Link>}
            </div>
        </div>

    )
}
