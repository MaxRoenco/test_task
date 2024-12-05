"use client"
import data from './tickets'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@radix-ui/react-dialog'
import Link from 'next/link'
import InputForm from '@/components/InputForm'

export default function page() {
    return (
        <div className='w-4/6 flex flex-col mx-auto my-10'>
            <div className='flex justify-between'>
                <h1 className='text-4xl font-bold'>My Tickets:</h1>
                <InputForm />
            </div>
            <div className="flex gap-2 flex-wrap w-full justify-between mt-10">
                {data.map((e, idx) => (
                    <Link className='overflow-hidden w-[49%]' key={idx} href={"/user_ticket/" + e.id}>
                        <Card key={idx} className="overflow-hidden w-full">
                            <CardContent className="p-0 h-40"> {/* Adjust height to desired image size */}
                                <img
                                    className="w-full h-full object-cover object-center"
                                    src={`https://picsum.photos/seed/${Math.random()}/800`}
                                    alt="Card image"
                                />
                            </CardContent>
                            <CardHeader>
                                <CardTitle>{e.subject}</CardTitle>
                                <CardDescription>{e.text}</CardDescription>
                                <CardDescription>{new Date(e.created_at).toLocaleDateString() + " " + new Date(e.created_at).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</CardDescription>
                            </CardHeader>
                            <CardFooter className='flex gap-2'>
                                <Badge>{e.bug_type}</Badge>
                                <Badge>{e.priority} priority</Badge>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
