'use client';

import { ExtendedUser } from "@/next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";

interface AvatarComponentGroupProps {
    users?: ExtendedUser[];
}

export const AvatarComponentGroup = ({ users = [] }: AvatarComponentGroupProps) => {
    const slicedUsers = users.slice(0, 3);

    const positionMap = {
        0: 'top-0 left-[12px]',
        1: 'bottom-0',
        2: 'bottom-0 right-0',
    }

    return (
        <div className="relative h-11 w-11">
            {slicedUsers.map((user, index) => (
                <div key={user.id}>
                    <Avatar className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px]
                        ${positionMap[index as keyof typeof positionMap]}`}>
                        <AvatarImage src={user?.image || '/images/user_profile_placeholder.jpeg'} />
                        <AvatarFallback className="bg-gray-500">
                            <FaUser className="text-white" />
                        </AvatarFallback>
                    </Avatar>
                    <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full ring-2 
                        ring-white transform translate-x-0.3 -translate-y-0.3"
                    />
                </div>
            ))}
        </div>
    )
}