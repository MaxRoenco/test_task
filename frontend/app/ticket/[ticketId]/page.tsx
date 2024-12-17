"use client"
import ChatComponent from '../../../components/Chat';
import { Card, CardHeader, CardTitle } from '../../../components/ui/card';
import { useState, useEffect, useCallback } from 'react';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useParams } from 'next/navigation'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Ticket from '@/lib/types/Ticket';
import { fetchTicket } from '@/lib/api';
import { toAMPM, toDMY } from '@/lib/tools/dates';

const ChatPage = () => {
  const params = useParams<{ ticketId: string }>()

  const [ticketInfo, setTicketInfo] = useState<Ticket | null>(null);
  const fetchTicketInfo = useCallback(async () => {
    const data = await fetchTicket(Number(params.ticketId));
    setTicketInfo(data);
  }, []);

  useEffect(() => {
    fetchTicketInfo();
  }, [fetchTicketInfo])

  return (
    <div className='h-screen w-full flex justify-center items-center flex-initial overflow-hidden'>
      <Card className='w-8/12 h-[95%] my-3 p-3'>
        {ticketInfo && <CardHeader>
          <CardTitle className='my-2'>{ticketInfo.subject}</CardTitle>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Show Details</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>{ticketInfo.subject}</DialogTitle>
                <DialogDescription className='my-5'>
                  {ticketInfo?.text}
                </DialogDescription>
                <DialogFooter className='flex w-full flex-row'>
                  <div className='flex w-full flex-row'>
                    <Badge className='text-center'>{ticketInfo.bugType}</Badge>
                  </div>
                </DialogFooter>
                <DialogDescription>
                  {`${toDMY(ticketInfo.createdAt)} ${toAMPM(ticketInfo.createdAt)}`}
                </DialogDescription>
              </DialogHeader>
              
              {(ticketInfo && ticketInfo.images && ticketInfo.images.length > 0) ? (
                <Carousel className="w-full max-w-md mx-auto">
                  <CarouselContent>
                    {ticketInfo.images.map((e, idx) => (
                      <CarouselItem key={idx} className="flex justify-center items-center">
                        <div className="p-1">
                          <Image 
                            width={400} 
                            height={300} 
                            alt={`bug report image ${idx + 1}`} 
                            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${e.url}`}
                            className="max-h-[300px] object-contain"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <p className="text-center text-muted-foreground">No images available</p>
              )}
            </DialogContent>
          </Dialog>

        </CardHeader>}
        {ticketInfo && <ChatComponent ticketId={ticketInfo.id} />}
      </Card>
    </div>
  );
};

export default ChatPage;