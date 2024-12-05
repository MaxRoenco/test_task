"use client"
import Link from 'next/link'

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
export type Ticket = {
    id: number
    subject: string
    bug_type: "UI" | "Performance" | "Functional"
    status: "open" | "in work" | "closed"
    text: string
    created_at: string
    updated_at: string
    priority: "high" | "medium" | "low"
}

export const columns: ColumnDef<Ticket>[] = [
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
        accessorKey: "status",
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
            const st = String(row.getValue("status"));
            let color : string = "text-red-500"
            if(st === "closed") color = "text-green-400";
            else if(st === "in work") color = "text-yellow-400";
            return <div className={"ml-4 text-left " + color}>{st}</div>
        },
    },
    {
        accessorKey: "priority",
        header: "Priority"
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => {
            return new Date(row.getValue("created_at")).toLocaleDateString("hi-IN");
        }
    },
    {
        accessorKey: "updated_at",
        header: "Updated At",
        cell: ({ row }) => {
            return new Date(row.getValue("updated_at")).toLocaleDateString("hi-IN");
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
                            onClick={() => navigator.clipboard.writeText(String(ticket.id))}
                        >
                            Copy ticket ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><Link href={"/dev/"+ticket.id}>View ticket details</Link></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
