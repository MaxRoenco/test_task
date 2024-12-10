<<<<<<< HEAD

import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { fetchTickets } from '@/lib/api'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import Image from 'next/image'
import InputForm from '@/components/InputForm'
import { cn } from '@/lib/utils'
import Ticket from '@/lib/types/Ticket'

export default async function BugReportsPage() {

    const bugReports : Ticket[] = await fetchTickets();
    console.log(bugReports);
=======
import InputForm from '@/components/InputForm'
import { Suspense } from 'react'
import Cards from '@/app/dashboard/Cards'

export default async function BugReportsPage() {
>>>>>>> ef31322008c495c8a7e345fd18cb2b8200efa6c9

    return (
        <div className='w-4/6 flex flex-col mx-auto my-10'>
            <div className='flex justify-between'>
                <h1 className='text-4xl font-bold'>My Tickets:</h1>
<<<<<<< HEAD
                <InputForm />
            </div>
            <div className="flex gap-2 flex-wrap w-full justify-between mt-10">
                {bugReports.length > 0 ? bugReports.map((e, idx) => (
                    <Link className='overflow-hidden w-[49%]' key={e.documentId} href={"/user_ticket/" + e.documentId + "-" + e.id}>
                        <Card className="overflow-hidden w-full">
                            <CardContent className="p-0 h-40">
                                <img
                                    className={cn("w-full h-full object-cover object-center")}
                                    src={e.hasOwnProperty("images") && e.images.length ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${e.images[0].url}` : `https://picsum.photos/seed/${idx+100}/800`}
                                    alt="Card image"
                                />
                            </CardContent>
                            <CardHeader>
                                <CardTitle>{e.subject}</CardTitle>
                                <CardDescription>{e.text}</CardDescription>
                                <CardDescription>
                                    {new Date(e.createdAt).toLocaleDateString() + " " + 
                                     new Date(e.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className='flex gap-2'>
                                <Badge>{e.bugType}</Badge>
                            </CardFooter>
                        </Card>
                    </Link>
                )) : "Loading..."}
=======
                <InputForm/>
            </div>
            <div className="flex gap-2 flex-wrap w-full justify-between mt-10">
                <Suspense fallback={<p>Loading...</p>}>
                    <Cards/>
                </Suspense>
>>>>>>> ef31322008c495c8a7e345fd18cb2b8200efa6c9
            </div>
        </div>
    );
}