'use client';

import MobileItem from "./mobile-item";
import useRoutes from "@/hooks/use-routes";
import useConversation from "@/hooks/use-conversation";


const MobileFooter = () => {
    const routes = useRoutes();
    const { isOpen } = useConversation();

    if (isOpen) return null;

    return (
        <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white
                border-t-[1px] lg:hidden">
            {routes.map(r => (
                <MobileItem
                    key={r.href}
                    href={r.href}
                    icon={r.icon}
                    active={r.active}
                    onClick={r.onClick}
                />
            ))}
        </div>
    )
}

export default MobileFooter;