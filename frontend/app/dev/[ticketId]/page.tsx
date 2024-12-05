import ChatComponent from '../../../components/Chat';
import { Card } from '../../../components/ui/card'

const ChatPage = ({ params }: { params: { ticketId: string } }) => {
  return (
    <div className='h-screen w-full flex justify-center items-center flex-initial'>
      <Card className='w-6/12 h-4/6 p-3'>
        <h1 className="text-3xl font-bold my-3">Ticket #{params.ticketId}</h1>
        <hr />
        <ChatComponent ticketId={parseInt(params.ticketId)} user={{ id: 0, name: "developer" }} />
      </Card>
    </div>
  );
};

export default ChatPage;
