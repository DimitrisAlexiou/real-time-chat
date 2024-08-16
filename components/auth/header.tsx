import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { FaTelegramPlane } from "react-icons/fa";

const font = Poppins({
    subsets: ['latin'],
    weight: ['600']
})

interface HeaderProps {
    label: string
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
            <h1 className={cn("text-3xl font-semibold flex items-center justify-center", font.className)}>
                Live Chat <FaTelegramPlane className="ml-3 shake" />
            </h1>
            <p className="text-muted-foreground text-sm">{label}</p>
        </div>
    )
}