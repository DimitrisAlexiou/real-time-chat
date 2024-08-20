import { Navbar } from "./_components/navbar";
import Sidebar from "./_components/sidebar";

interface ProtectedLayoutProps {
    children: React.ReactNode
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return (
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
            <div className="sm:mx-auto">
                <Sidebar>
                    <Navbar />
                    {children}
                </Sidebar>
            </div>
        </div>
    );
}

export default ProtectedLayout;