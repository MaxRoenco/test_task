"use client"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import InputForm from '@/components/InputForm'
import { useState, useEffect, useCallback } from 'react'

interface Bug {
    id: number,
    subject: string,
    text: string,
    createdAt: string,
    bug_type: string,
}

export default function BugReportsPage() {
    const [bugReports, setBugReports] = useState<Bug[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchBugReports = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:1337/api/bug-reports?populate=*');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setBugReports(data.data);
            console.log(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    }, []);

    useEffect(() => {
        fetchBugReports();
    }, [fetchBugReports])

    return (
        <div className='w-4/6 flex flex-col mx-auto my-10'>
            <div className='flex justify-between'>
                <h1 className='text-4xl font-bold'>My Tickets:</h1>
                <InputForm onSubmitSuccess={fetchBugReports} />
            </div>
            <div className="flex gap-2 flex-wrap w-full justify-between mt-10">
                {bugReports.length > 0 ? bugReports.map((e, idx) => (
                    <Link className='overflow-hidden w-[49%]' key={e.id} href={"/user_ticket/" + e.id}>
                        <Card className="overflow-hidden w-full">
                            <CardContent className="p-0 h-40">
                                <img
                                    className="w-full h-full object-cover object-center"
                                    src={`https://picsum.photos/seed/${e.id}/800`}
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