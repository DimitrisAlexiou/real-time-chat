'use client';

import axios from "axios";
import { find } from "lodash";
import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { ExtendedMessage } from "@/types/conversation";
import { MessageBox } from "./message-box";
import useConversation from "@/hooks/use-conversation";

interface BodyProps {
    initialMessages: ExtendedMessage[];
}

export const Body = ({ initialMessages }: BodyProps) => {
    const [messages, setMessages] = useState(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId]);

    useEffect(() => {
        pusherClient.subscribe(conversationId);
        bottomRef?.current?.scrollIntoView({ behavior: "smooth" });

        const messageHandler = (message: ExtendedMessage) => {
            axios.post(`/api/conversations/${conversationId}/seen`);

            setMessages((current) => {
                if (find(current, { id: message.id }))
                    return current;

                return [...current, message];
            });
            bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
        };

        const updateMessageHandler = (newMessage: ExtendedMessage) => {
            setMessages((current) => current.map((currentMessage) => {
                if (currentMessage.id === newMessage.id)
                    return newMessage;

                return currentMessage;
            }));
        };

        pusherClient.bind("messages:new", messageHandler);
        pusherClient.bind("message:update", updateMessageHandler);

        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind("messages:new", messageHandler);
            pusherClient.unbind("message:update", updateMessageHandler);
        };
    }, [conversationId]);

    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map((message, index) => (
                <MessageBox
                    isLast={index === messages.length - 1}
                    key={message.id}
                    data={message}
                />
            ))}
            <div ref={bottomRef} className="pt-24" />
        </div>
    )
}