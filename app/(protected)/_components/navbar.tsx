'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
    const pathname = usePathname();

    return (
        <div className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
            <div className="flex gap-x-2">
                <Button
                    asChild
                    variant={pathname === '/users' ? 'default' : 'outline'}
                >
                    <Link href={'/users'}>
                        Users
                    </Link>
                </Button>
                <Button
                    asChild
                    variant={pathname === '/settings' ? 'default' : 'outline'}
                >
                    <Link href={'/settings'}>
                        Settings
                    </Link>
                </Button>
            </div>
            <UserButton />
        </div>
    )
}