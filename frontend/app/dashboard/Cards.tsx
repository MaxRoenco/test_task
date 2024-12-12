'use client'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { getTicketsByUserID } from '@/lib/api'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { toAMPM, toDMY } from '@/lib/tools/dates'
import { useEffect, useState, useContext } from 'react'
import Ticket from '@/lib/types/Ticket'
import { triggerContext } from './page'
import Image from 'next/image'

export default function Cards() {
    const { trigger, setTrigger } = useContext(triggerContext)!;
    const [bugReports, setBugReports] = useState<Ticket[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const tickets = await getTicketsByUserID(localStorage.getItem("userID") || "-1");
                setBugReports(tickets || []);
                console.log(`Tickets: ${tickets}`);
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, [trigger, setTrigger]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!bugReports.length) {
        return <div>You don't have any tickets...</div>;
    }

    return (
        <>
            {[...bugReports].reverse().map((e, idx) => (
                <Link className='overflow-hidden w-[49%]' key={e.documentId} href={`/ticket/${e.id}`}>
                    <Card className="overflow-hidden w-full">
                        <CardContent className="p-0 h-40 flex justify-center items-center">
                            <div className="relative size-20 w-full h-full">
                                <Image src={e.hasOwnProperty("images") && e.images && e.images.length
                                    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${e.images[0].url}`
                                    : `https://picsum.photos/seed/${idx + 100}/800`}
                                    alt="Card image"
                                    fill={true}
                                    className="object-cover"
                                />
                            </div>
                        </CardContent>
                        <CardHeader>
                            <CardTitle>{e.subject}</CardTitle>
                            <CardDescription>{e.text}</CardDescription>
                            <CardDescription>
                                {`${toDMY(e.createdAt)} ${toAMPM(e.createdAt)}`}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className='flex gap-2'>
                            <Badge>{e.bugType}</Badge>
                        </CardFooter>
                    </Card>
                </Link>
            ))}
        </>
    );
}