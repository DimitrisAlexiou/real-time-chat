'use client';

import { useCurrentUser } from "@/hooks/use-current-user";
import DesktopSidebar from "./desktop-sidebar";
import MobileFooter from "./mobile-footer";

export default function Sidebar({ children }: {
    children: React.ReactNode;
}) {
    const user = useCurrentUser();

    return (
        <div className="h-full">
            <DesktopSidebar user={user} />
            <MobileFooter />
            <main className="lg:pl-20 h-full">
                {children}
            </main>
        </div>
    );
}