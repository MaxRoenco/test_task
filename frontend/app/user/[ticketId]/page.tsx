import ChatComponent from '../../../components/Chat';

const ChatPage = ({params}:{params: {ticketId: string}}) => {
  return (
    <div style={{ width: '400px', margin: '0 auto', paddingTop: '50px' }}>
      <h1 className="text-3xl font-bold">Ticket #{params.ticketId}</h1>
      <ChatComponent ticketId={parseInt(params.ticketId)} user={{id: 1, name: "user"}}/>
    </div>
  );
};

export default ChatPage;
