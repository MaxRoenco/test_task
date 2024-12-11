'use client';

import { useEffect, useState, useRef } from 'react';
import { ChatMessageList } from './ui/chat/chat-message-list';
import { ChatBubble } from './ui/chat/chat-bubble';
import { ChatBubbleAvatar } from './ui/chat/chat-bubble';
import { ChatBubbleMessage } from './ui/chat/chat-bubble';
import { ChatInput } from './ui/chat/chat-input';
import { Button } from './ui/button';
import { FiCornerDownLeft } from "react-icons/fi";

import { ScrollArea } from "./ui/scroll-area"
import Message from '@/lib/types/Message';

import User from '@/lib/types/User';
import { toAMPM } from '@/lib/tools/dates';

const ChatComponent = ({ ticketId, user } : { ticketId: number, user: User }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const cardRef : any = useRef(null);

    useEffect(() => {
        const socket = new WebSocket(String(process.env.NEXT_PUBLIC_WEBSOCKET_URL));

        socket.onopen = () => {
            socket.send(JSON.stringify({ type: 'init', user, ticketId }));
            console.log("Connected to socket");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'message') {
                setMessages((prevMessages) => [...prevMessages, data]);
            } else if(data.type === 'messages') {
                console.log("MESSAGES:",data.messages);
                setMessages((prevMessages) => [...prevMessages, ...data.messages]);
            }
        };

        socket.onclose = (event) => {
            ws?.send(JSON.stringify({ type: "close" }));
        }

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    const handleSendMessage = () => {
        if (ws && message.trim() !== '') {
            ws.send(JSON.stringify({ type: 'message', text: message, ticketId, userId: user.id, userName: user.name }));
            setMessage('');
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
          cardRef?.current?.scrollIntoView({ behavior: "smooth" });
        }
      }, [messages.length]);

    return (
        <>
            <ScrollArea className='h-4/6' id='scroller'>
                <ChatMessageList>
                    {messages.map((msg, index) => (
                        <ChatBubble 
                            ref={index + 1 === messages.length ? cardRef : null} 
                            key={index} variant={msg.userId === user.id ? "sent" : "received"}
                        >
                            <ChatBubbleAvatar fallback='US' />
                            <ChatBubbleMessage variant={msg.userId === user.id ? "sent" : "received"}>
                                {msg.userId === user.id || <p className='text-xs text-bold mb-1'>{msg.userName}</p>}
                                {msg.text}
                                <p className='text-xs'>{toAMPM(msg.timestamp)}</p>
                            </ChatBubbleMessage>
                        </ChatBubble>
                    ))}
                </ChatMessageList>
            </ScrollArea>
            <div className='flex flex-row gap-2 items-center h-1/6'>
                <ChatInput
                    placeholder="Type your message here..."
                    className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                    onClick={handleSendMessage}
                    size="sm"
                >
                    Send Message
                    <FiCornerDownLeft className="size-3.5" />
                </Button>
            </div>
        </>
    );
};

export default ChatComponent;