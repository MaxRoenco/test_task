"use client"
import Link from 'next/link'
import { cn } from '../../lib/utils'
import {toDMY} from '../../lib/tools/dates'

import { ColumnDef } from "@tanstack/react-table"

import { ArrowUpDown } from "lucide-react"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Bug = {
    id: number,
    subject: string,
    text: string,
    createdAt: string,
    updatedAt: string,
    bug_type: string,
    statusBug: string,
    priority: string,
    documentId: string,
}

export const columns: ColumnDef<Bug>[] = [
    {
        accessorKey: "subject",
        header: "Subject",
    },
    {
        accessorKey: "bug_type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Bug Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const bt = String(row.getValue("bug_type"));
            return <div className="ml-4 text-left">{bt}</div>
        },
    },
    {
        accessorKey: "statusBug",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const st = String(row.getValue("statusBug"));
            return <div className={cn("ml-4 text-left ", {
                "text-red-500": st === "Open",
                "text-yellow-400": st === "In Work",
                "text-green-400": st === "Closed",
            })}>{st}</div>
        },
    },
    {
        accessorKey: "priority",
        header: "Priority"
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            return toDMY(row.getValue("createdAt"));
        }
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => {
            return toDMY(row.getValue("updatedAt"));
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const ticket = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(ticket.documentId + "-" + ticket.id)}
                        >
                            Copy ticket ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><Link href={"/dev/"+ticket.documentId + "-" + ticket.id}>View ticket details</Link></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]