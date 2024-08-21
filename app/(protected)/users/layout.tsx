import { getUsers } from "@/actions/get-users";
import Sidebar from "../_components/sidebar";
import UserList from "./components/user-list";

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
    const users = await getUsers();

    return (
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
            <div className="sm:mx-auto">
                <Sidebar>
                    <UserList items={users} />
                    {children}
                </Sidebar>
            </div>
        </div>
    );
}