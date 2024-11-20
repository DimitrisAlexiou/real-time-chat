'use client';

import { ExtendedUser } from "@/next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { useIsActive } from "@/hooks/use-is-active";

interface AvatarComponentProps {
    user?: ExtendedUser;
}

export const AvatarComponent = ({ user }: AvatarComponentProps) => {
    const isActive = useIsActive(user?.email!);

    return (
        <div className="relative inline-block">
            <Avatar className="w-10 h-10">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="bg-gray-500">
                    <FaUser className="text-white" />
                </AvatarFallback>
            </Avatar>
            {isActive && (
                <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full ring-2 
                    ring-white transform translate-x-0.3 -translate-y-0.3"
                />
            )}
        </div>
    )
}