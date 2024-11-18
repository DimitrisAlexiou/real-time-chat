'use client';

import Link from "next/link";
import { useMemo, useState } from "react";
import { ExtendedUser } from "@/next-auth";
import { Conversation } from "@prisma/client";
import { useOtherUser } from "@/hooks/use-other-user";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import { AvatarComponent } from "@/app/(protected)/_components/avatar";
import { ProfileDrawer } from "./profile-drawer";

interface HeaderProps {
    conversation: Conversation & {
        users: ExtendedUser[]
    }
}

export const Header = ({ conversation }: HeaderProps) => {
    const otherUser = useOtherUser(conversation);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const statusText = useMemo(() => {
        if (conversation.isGroup) return `${conversation.users.length} members`;

        return 'Active';
    }, [conversation]);

    return (
        <>
            <ProfileDrawer
                data={conversation}
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
            <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
                <div className="flex gap-3 items-center">
                    <Link
                        className="lg:hidden block text-gray-500 hover:text-gray-600 transition cursor-pointer"
                        href="/conversations"
                    >
                        <HiChevronLeft size={32} />
                    </Link>
                    <AvatarComponent user={otherUser} />
                    <div className="flex flex-col">
                        <div>
                            {conversation.name || otherUser.name}
                        </div>
                        <div className="text-sm font-light text-neutral-500">
                            {statusText}
                        </div>
                    </div>
                </div>
                <HiEllipsisHorizontal
                    size={32}
                    onClick={() => setDrawerOpen(true)}
                    className="text-gray-500 hover:text-gray-600 transition cursor-pointer"
                />
            </div>
        </>
    )
}