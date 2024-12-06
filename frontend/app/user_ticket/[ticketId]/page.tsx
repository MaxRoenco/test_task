// @ts-nocheck
"use client"
import ChatComponent from '../../../components/Chat';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { useState, useEffect, useCallback } from 'react';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Bug {
  documentId: string,
  id: number,
  subject: string,
  text: string,
  createdAt: string,
  bug_type: string,
  priority: string,
}

const ChatPage = ({ params }: { params: { ticketId: string } }) => {
  const ids = params.ticketId.split("-");
  const [ticketInfo, setTicketInfo] = useState<Bug>();
  const [error, setError] = useState<string | null>(null);

  const fetchTicketInfo = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:1337/api/bug-reports/' + ids[0]);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTicketInfo(data.data);
      console.log(data.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  }, []);

  useEffect(() => {
    fetchTicketInfo();
  }, [fetchTicketInfo])
  return (
    <div className='h-screen w-full flex justify-center items-center flex-initial overflow-hidden'>
      <Card className='w-8/12 h-[95%] my-3 p-3'>
        <CardHeader>
          <CardTitle className='my-2'>#{ticketInfo?.subject}</CardTitle>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Show Details</Button>
            </DialogTrigger>

            <DialogHeader>
              <DialogTitle>{ticketInfo?.subject}</DialogTitle>
              <DialogDescription className='my-5'>
                {ticketInfo?.text}
                <br /><br />
                <Badge className='mr-1'>{ticketInfo?.bug_type}</Badge>
                <Badge>{ticketInfo?.priority}</Badge>
              </DialogDescription>
              <DialogDescription>
                {new Date(ticketInfo?.createdAt).toLocaleDateString() + " " + new Date(ticketInfo?.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
              </DialogDescription>
            </DialogHeader>
            <DialogContent>
              {(ticketInfo && ticketInfo.hasOwnProperty("attachments")) ? ticketInfo.attachments.map((e, idx) => {
                return <Image width={30} height={30} src={binaryStringToImageSrc(e.binaryData, e.url, idx)} />;
              }) : ""}
            </DialogContent>
          </Dialog>
        </CardHeader>
        <ChatComponent ticketId={ids[1]} documentId={ids[0]} user={{ id: 1, name: "user" }} />
      </Card>
    </div>
  );
};

export default ChatPage;
