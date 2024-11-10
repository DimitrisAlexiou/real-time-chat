import { getConversations } from "@/actions/get-conversations";
import ConversationsList from "./components/conversation-list";
import Sidebar from "../_components/sidebar";

export default async function ConversationsLayout({ children }: { children: React.ReactNode }) {
    const conversations = await getConversations();

    return (
        // <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
        // <div className="sm:mx-auto">
        <Sidebar>
            <ConversationsList conversations={conversations} />
            {children}
        </Sidebar>
        // </div>
        // </div>
    )
}