'use client';

import EmptyState from "@/components/empty-state";
import useConversation from "@/hooks/use-conversation";
import clsx from "clsx";

const Home = () => {
    const { isOpen } = useConversation();

    return (
        <div className={clsx('lg:pl-80 h-full lg:block', isOpen ? 'block' : 'hidden')}>
            <EmptyState />
        </div>
    )
}

export default Home;