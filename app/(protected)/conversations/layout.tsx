import { getConversations } from "@/actions/get-conversations";
import { getUsers } from "@/actions/get-users";
import { ConversationList } from "./components/conversation-list";
import Sidebar from "../_components/sidebar";

export default async function ConversationsLayout({ children }: { children: React.ReactNode }) {
    const conversations = await getConversations();
    const users = await getUsers();

    return (
        <Sidebar>
            <ConversationList users={users} conversations={conversations} />
            {children}
        </Sidebar>
    )
}