'use client';

import axios from 'axios'
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ExtendedUser } from "@/next-auth";
import { AvatarComponent } from '../../_components/avatar';

interface UserBoxProps {
    data: ExtendedUser;
}
const UserBox = ({ data }: UserBoxProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = useCallback(() => {
        setIsLoading(true);

        axios.post('/api/conversations', {
            userId: data.id,
        }).then((data) => {
            router.push(`/conversations/${data.data.id}`);
        }).finally(() => {
            setIsLoading(false);
        }).catch((error) => {
            console.error(error);
        });
    }, [data, router]);

    return (
        <div
            onClick={handleClick}
            className="w-full realtive flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100
                    rounded-lg transition cursor-pointer"
        >
            <AvatarComponent user={data} />
            <div className='min-w-0 flex-1'>
                <div className='focus:outline-none'>
                    <div className='flex justify-between items-center mb-1'>
                        <p className='text-md font-medium text-gray-900'>
                            {data.name}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserBox;