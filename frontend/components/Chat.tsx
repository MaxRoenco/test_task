'use client';

import { useEffect, useState } from 'react';
import { ChatMessageList } from './ui/chat/chat-message-list';
import { ChatBubble } from './ui/chat/chat-bubble';
import { ChatBubbleAvatar } from './ui/chat/chat-bubble';
import { ChatBubbleMessage } from './ui/chat/chat-bubble';
import { ChatInput } from './ui/chat/chat-input';
import { Button } from './ui/button';
import { FiCornerDownLeft } from "react-icons/fi";

const ChatComponent = ({ticketId, user}:{ticketId: number, user: {id: number, name: string}}) => {
    const [message, setMessage] = useState('');
    interface Message {
        type: string;
        id: string;
        content: string;
        variant: "sent" | "received";
    }
    const [messages, setMessages] = useState<Message[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [clientId, setClientId] = useState<string | null>(null); // To store the client's ID

    // Set up WebSocket connection on component mount
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3001'); // Connect to WebSocket server

        socket.onopen = () => {
            socket.send(JSON.stringify({ type: 'init', user,  ticketId}));
            console.log("Connected to socket");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if(data.type === 'message') {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
        };

        socket.onclose = (event) => {
            ws?.send(JSON.stringify({type: "close", ticketId}));
        }

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    const handleSendMessage = () => {
        if (ws && message.trim() !== '') {
            ws.send(JSON.stringify({type: 'message', content: message, ticketId, user}));
            setMessage('');
        }
    };

    return (
        <div>
            <ChatMessageList>
                {messages.map((msg, index) => (
                    <ChatBubble key={index} variant={msg.variant}>
                        <ChatBubbleAvatar fallback='US' />
                        <ChatBubbleMessage variant={msg.variant}>
                            {msg.content}
                        </ChatBubbleMessage>
                    </ChatBubble>
                ))}

                {/* <ChatBubble variant='received'>
        <ChatBubbleAvatar fallback='AI' />
        <ChatBubbleMessage isLoading />
    </ChatBubble> */}
            </ChatMessageList>
            <ChatInput
                placeholder="Type your message here..."
                className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex items-center p-3">
                <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="ml-auto"
                >
                    Send Message
                    <FiCornerDownLeft className="size-3.5" />
                </Button>
            </div>
        </div>
    );
};

export default ChatComponent;

