"use client"
import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from 'next/navigation'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    canNextPage: boolean
    canPrevPage: boolean
    totalPages: number
    pageNumber: number
    sort?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    canNextPage,
    canPrevPage,
    totalPages,
    pageNumber,
    sort
}: DataTableProps<TData, TValue>) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Parse initial sorting from URL or props
    const initialSorting = React.useMemo(() => {
        if (sort) {
            const [id, desc] = sort.split(':');
            return [{ id, desc: desc === 'desc' }];
        }
        return [];
    }, [sort]);

    const [sorting, setSorting] = React.useState<SortingState>(initialSorting);

    // Handle sorting change
    const handleSortingChange = React.useCallback((updater: React.SetStateAction<SortingState>) => {
        // Update local state
        setSorting(updater);

        // Get the new sorting state
        const newSorting = typeof updater === 'function' 
            ? updater(sorting) 
            : updater;

        // If sorting changed, update URL without full page reload
        if (newSorting.length > 0) {
            const newSort = `${newSorting[0].id}:${newSorting[0].desc ? "desc" : "asc"}`;
            
            // Create new search params
            const params = new URLSearchParams(searchParams);
            params.set('sort', newSort);
            
            // Replace URL without full reload
            router.replace(`/tickets?${params.toString()}`, { scroll: false });
        }
    }, [router, searchParams]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
        },
        onSortingChange: handleSortingChange,
        manualSorting: true,
        defaultColumn: {
            size: 200,
            minSize: 50,
            maxSize: 500,
        },
    })

    // Create a function to navigate with preserved sorting
    const navigateWithSort = (page: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        
        // Preserve sorting if exists
        if (sort) {
            params.set('sort', sort);
        }

        router.push(`/tickets?${params.toString()}`);
    }

    return (
        <div className="mx-10">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter tickets..."
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
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWithSort(1)}
                    disabled={!canPrevPage}
                >
                    First
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWithSort(pageNumber - 1)}
                    disabled={!canPrevPage}
                >
                    Previous
                </Button>
                <p className="mr-1 text-gray-500">{`Page ${pageNumber} out of ${totalPages}`}</p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWithSort(pageNumber + 1)}
                    disabled={!canNextPage}
                >
                    Next
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWithSort(totalPages)}
                    disabled={!canNextPage}
                >
                    Last
                </Button>
            </div>
        </div>
    )
}