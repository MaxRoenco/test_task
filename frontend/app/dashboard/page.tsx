
"use client"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import InputForm from '@/components/InputForm'
import { useState, useEffect, useCallback } from 'react'

interface Bug {
    documentId: string,
    id: number,
    subject: string,
    text: string,
    createdAt: string,
    bug_type: string,
    attachments: any;
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


    // images in strapi can be saved much easier!!!
    function binaryStringToImageSrc(binaryString: string, mimeType = 'image/png', idx:number) {
        if(!binaryString) return `https://picsum.photos/seed/${idx+100}/800`;
        // Create a Uint8Array from the binary string
        const byteArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }

        // Create a Blob using the byte array
        const blob = new Blob([byteArray], { type: mimeType });

        // Generate an Object URL from the Blob
        return URL.createObjectURL(blob);
      }


    return (
        <div className='w-4/6 flex flex-col mx-auto my-10'>
            <div className='flex justify-between'>
                <h1 className='text-4xl font-bold'>My Tickets:</h1>

                <div> Why not router refresh here?????</div>
                <InputForm onSubmitSuccess={fetchBugReports} />
            </div>
            <div className="flex gap-2 flex-wrap w-full justify-between mt-10">
                {bugReports.length > 0 ? bugReports.map((e, idx) => (
                    <Link className='overflow-hidden w-[49%]' key={e.documentId} href={"/user_ticket/" + e.documentId + "-" + e.id}>
                        <Card className="overflow-hidden w-full">
                            <CardContent className="p-0 h-40">
                                <img
                                    className="w-full h-full object-cover object-center"
                                    //here will be used src of strapi image
                                    src={e.hasOwnProperty("attachments") && e.attachments.length ? binaryStringToImageSrc(e.attachments[0].binaryData, e.attachments[0].url, idx) : `https://picsum.photos/seed/${idx+100}/800`}
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