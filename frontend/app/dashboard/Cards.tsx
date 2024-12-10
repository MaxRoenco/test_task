
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { fetchTickets } from '@/lib/api'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Ticket from '@/lib/types/Ticket'
import { toAMPM, toDMY } from '@/lib/tools/dates'

export default async function Cards() {

    const bugReports: Ticket[] = await fetchTickets();

    let cards: string | React.JSX.Element[] = "You don't have any tickets...";

    if (bugReports && bugReports.length > 0) {
        cards = bugReports.map((e, idx) => (
            <Link className='overflow-hidden w-[49%]' key={e.documentId} href={"/user_ticket/" + e.documentId + "-" + e.id}>
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