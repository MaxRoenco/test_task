//@ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { ChatMessageList } from './ui/chat/chat-message-list';
import { ChatBubble } from './ui/chat/chat-bubble';
import { ChatBubbleAvatar } from './ui/chat/chat-bubble';
import { ChatBubbleMessage } from './ui/chat/chat-bubble';
import { ChatInput } from './ui/chat/chat-input';
import { Button } from './ui/button';
import { FiCornerDownLeft } from "react-icons/fi";

import { ScrollArea } from "./ui/scroll-area"
import Message from '@/lib/types/Message';

import { useParams } from 'next/navigation'
import User from '@/lib/types/User';

const ChatComponent = (params : { ticketId: number, user: User }) => {

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);

    // Set up WebSocket connection on component mount
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3001'); // Connect to WebSocket server

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

    return (
        <>
            <ScrollArea className='h-4/6'>
                <ChatMessageList>
                    {messages.map((msg, index) => (
                        <ChatBubble key={index} variant={msg.userId === user.id ? "sent" : "received"}>
                            <ChatBubbleAvatar fallback='US' />
                            <ChatBubbleMessage variant={msg.userId === user.id ? "sent" : "received"}>
                                {msg.userId === user.id || <p className='text-xs text-bold mb-1'>{msg.userName}</p>}
                                {msg.text}
                                <p className='text-xs'>{new Date(msg.timestamp).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
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