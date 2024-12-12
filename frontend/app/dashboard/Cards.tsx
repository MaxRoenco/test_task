'use client'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { fetchTickets, getTicketsByUserID } from '@/lib/api'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Ticket from '@/lib/types/Ticket'
import { toAMPM, toDMY } from '@/lib/tools/dates'
import { useEffect, useState } from 'react'
import Data from '@/lib/types/Data'

export default function Cards() {
    const [userID, setUserID] = useState<string>('');
    const [bugReports, setBugReports] = useState<any[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedUserID = localStorage.getItem("userID") || "-1";
        setUserID(storedUserID);
        console.log(userID)

        const fetchTickets = async () => {
            try {
                const tickets = await getTicketsByUserID(userID);
                setBugReports(tickets || []);
                console.log(`Tickets: ${tickets}`);
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [userID]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!bugReports.length) {
        return <div>You don't have any tickets...</div>;
    }

    let cards: string | React.JSX.Element[] = "You don't have any tickets...";

    if (bugReports && bugReports.length > 0) {
        cards = bugReports.map((e : any, idx) => (
            <Link className='overflow-hidden w-[49%]' key={e.documentId} href={`/ticket/${e.id}`}>
                <Card className="overflow-hidden w-full">
                    <CardContent className="p-0 h-40">
                        <img
                            className={cn("w-full h-full object-cover object-center")}
                            src={e.hasOwnProperty("images") && e.images && e.images.length ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${e.images[0].url}` : `https://picsum.photos/seed/${idx + 100}/800`}
                            alt="Card image"
                        />
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
        ));
    }

    return cards;
}