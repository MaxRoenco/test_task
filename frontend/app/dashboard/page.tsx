
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { fetchTickets } from '@/lib/api'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import Image from 'next/image'
import InputForm from '@/components/InputForm'

interface Bug {
    documentId: string,
    id: number,
    subject: string,
    text: string,
    createdAt: string,
    bug_type: string,
    images: any
}

export default async function BugReportsPage() {

    const bugReports : Bug[] = await fetchTickets();
    console.log(bugReports);

    return (
        <div className='w-4/6 flex flex-col mx-auto my-10'>
            <div className='flex justify-between'>
                <h1 className='text-4xl font-bold'>My Tickets:</h1>
                <InputForm />
            </div>
            <div className="flex gap-2 flex-wrap w-full justify-between mt-10">
                {bugReports.length > 0 ? bugReports.map((e, idx) => (
                    <Link className='overflow-hidden w-[49%]' key={e.documentId} href={"/user_ticket/" + e.documentId + "-" + e.id}>
                        <Card className="overflow-hidden w-full">
                            <CardContent className="p-0 h-40">
                                <img
                                    className="w-full h-full object-cover object-center"
                                    src={e.hasOwnProperty("images") && e.images.length ? `http://localhost:1337${e.images[0].url}` : `https://picsum.photos/seed/${idx+100}/800`}
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
                                <Badge>{e.bug_type}</Badge>
                                <Badge>{["High", "Medium", "Low"][Math.floor(Math.random()*3)]} priority</Badge>
                            </CardFooter>
                        </Card>
                    </Link>
                )) : "Loading..."}
            </div>
        </div>
    );
}