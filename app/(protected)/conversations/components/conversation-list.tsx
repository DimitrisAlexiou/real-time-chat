'use client';

import clsx from "clsx";
import { find } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { ExtendedUser } from "@/next-auth";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ExtendedConversation } from "@/types/conversation";
import { MdOutlineGroupAdd } from 'react-icons/md'
import { ConversationBox } from "./conversation-box";
import { GroupChatModal } from "./group-chat-modal";
import { pusherClient } from "@/lib/pusher";
import useConversation from "@/hooks/use-conversation";

interface ConversationListProps {
    conversations: ExtendedConversation[];
    users: ExtendedUser[];
}

export const ConversationList = ({ conversations, users }: ConversationListProps) => {
    const session = useSession();
    const [conversationItems, setConversationItems] = useState(conversations);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();
    const { conversationId, isOpen } = useConversation();

    const pusherKey = useMemo(() => {
        return session?.data?.user?.email;
    }, [session?.data?.user?.email]);

    useEffect(() => {
        if (!pusherKey)
            return;

        pusherClient.subscribe(pusherKey);

        const newHandler = (conversation: ExtendedConversation) => {
            setConversationItems((current) => {
                if (find(current, { id: conversation.id }))
                    return current;

                return [conversation, ...current];
            });
        };

        const updateHandler = (conversation: ExtendedConversation) => {
            setConversationItems((current) => current.map(currentConversation => {
                if (currentConversation.id === conversation.id)
                    return {
                        ...currentConversation,
                        messages: conversation.messages
                    };

                return currentConversation;
            }));
        };

        const removeHandler = (conversation: ExtendedConversation) => {
            setConversationItems((current) => {
                return [...current.filter((conv) => conv.id !== conversation.id)];
            });

            if (conversationId === conversation.id)
                router.push('/conversations');
        };

        pusherClient.bind('conversation:new', newHandler);
        pusherClient.bind('conversation:update', updateHandler);
        pusherClient.bind('conversation:remove', removeHandler);

        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind('conversation:new', newHandler);
            pusherClient.unbind('conversation:update', updateHandler);
            pusherClient.unbind('conversation:remove', removeHandler);
        }
    }, [conversationId, pusherKey, router]);

    return (
        <>
            <GroupChatModal
                users={users}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <aside className={clsx('fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200',
                isOpen ? 'hidden' : 'block w-full left-0'
            )}>
                <div className="px-5">
                    <div className="flex justify-between mb-4 pt-4">
                        <div className="text-2xl font-bold text-neutral-800">
                            Messages
                        </div>
                        <div
                            onClick={() => setIsModalOpen(true)}
                            className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition">
                            <MdOutlineGroupAdd size={20} />
                        </div>
                    </div>
                    {conversationItems.map(conversation => (
                        <ConversationBox
                            key={conversation.id}
                            data={conversation}
                            selected={conversationId === conversation.id}
                        />
                    ))}
                </div>
            </aside>
        </>
    )
}