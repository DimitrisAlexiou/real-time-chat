'use client';

import { useState } from "react";
import { ExtendedUser } from "@/next-auth";
import useRoutes from "@/hooks/use-routes";
import DesktopItem from "./desktop-item";
import AvatarComponent from "./avatar";

interface DesktopSidebarProps {
    user?: ExtendedUser;
}
const DesktopSidebar = ({ user }: DesktopSidebarProps) => {
    const routes = useRoutes();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 
                lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between">
            <nav className="mt-4 flex flex-col justify-between">
                <ul role="list" className="flex flex-col items-center space-y-1">
                    {routes.map(r => (
                        <DesktopItem
                            key={r.label}
                            href={r.href}
                            label={r.label}
                            icon={r.icon}
                            active={r.active}
                            onClick={r.onClick}
                        />
                    ))}
                </ul>
            </nav>
            <nav className="mt-4 flex flex-col justify-between items-center">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="cursor-pointer hover:opacity-75 transition"
                >
                    <AvatarComponent user={user} />
                </div>
            </nav>
        </div>
    )
}

export default DesktopSidebar;