 

"use client";

import { usePathname} from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";
import JobOrdersIcon from "@/components/icons/JobOrdersIcon";
import {
    PanelRightClose as MenuBarIcon,
    LayoutDashboard,
    User,
    ChartNoAxesCombined,
    RefreshCcw,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type Option = {
    type?: string;
    url: string;
    title?: string;
    identifier?: string;
    icon?: JSX.Element; 
};

import { cn } from "@/lib/utils"; 
import AnimateButton from "../animated/AnimateButton";

export default function Sidebar() {
    const router = usePathname(); // Access the current route

    const currentPath = router;

    const options: Option[] = [
        {
            title: "Dashboard",
            url: "/dashboard",
            identifier: "dashboard",
            icon: (
                <LayoutDashboard
                    fill={currentPath === "/dashboard" ? "currentColor" : "none"}
                    className={`me-2 ${currentPath === "/dashboard" ? "text-primary" : "text-[#75829C]"}`}
                    size="1.3em"
                />
            ),
        },
        {
            title: "Masters",
            url: "/masters",
            identifier: "masters",
            icon: (
                <User
                    fill={currentPath === "/masters" ? "currentColor" : "none"}
                    className={`me-2 ${currentPath === "/masters" ? "text-primary" : "text-[#75829C]"}`}
                    size="1.3em"
                />
            ),
        },
        {
            title: "Reports",
            url: "/reports",
            identifier: "reports",
            icon: (
                <RefreshCcw
                     className={`me-2 ${currentPath === "/reports" ? "text-primary" : "text-[#75829C]"}`}
                    size="1.3em"
                />
            ),
        },
        
        {
            title: "Transactions",
            url: "/transactions",
            identifier: "transactions",
            icon: (
                <ChartNoAxesCombined
                    fill={currentPath === "/transactions" ? "currentColor" : "none"}
                    className={`me-2 ${currentPath === "/transactions" ? "text-primary" : "text-[#75829C]"}`}
                    size="1.3em"
                />
            ),
        },
        {
            title: "Job Orders",
            url: "/job-orders",
            identifier: "job-orders",
            icon: <JobOrdersIcon isLive={currentPath === "/job-orders"} />,
        },
    ];
    const urls = ["overview"]; // Static value

    return (
        <>
            <Sheet>
                <SheetTrigger className="absolute left-5  top-[2.75rem] z-[9999] text-muted-foreground sm:hidden">
                    <MenuBarIcon />
                </SheetTrigger>
                <SheetContent side="left" className="z-[9999] max-w-72 p-0">
                    <SidebarItems
                        className="border-none"
                        urls={urls}
                        options={options}
                    />
                </SheetContent>
            </Sheet>
            <SidebarItems
                className="sticky top-0 z-50 hidden h-[90vh] min-w-72 sm:block"
                urls={urls}
                options={options}
            />
        </>
    );
}

function SidebarItems({
    options,
    urls,
    className,
}: {
    options: Option[];
    urls: string[];
    className?: string;
}) {
    const currentPathname = usePathname(); // Access the current route

    return (
        <aside
            className={cn(
                "border border-t-0 bg-secondary p-2 py-8 backdrop-blur-lg",
                className
            )}
        > 
            <div className="grid gap-2">
                {options.map((opt, index) => (
                    <AnimateButton className={`${currentPathname === "/"+opt.identifier  && "border-r-[3px] border-primary"}`} key={opt.identifier || index}>
                        {opt.type !== "separator" ? (
                            <>
                                {currentPathname === "/"+opt.identifier ? (
                                    <Link href={opt.url}  legacyBehavior>
                                        <Button variant={"ghost"} className="flex w-full justify-start shadow-sm">
                                            {opt.icon}
                                            <span className="text-start">
                                                {opt.title}
                                            </span>
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href={opt.url} legacyBehavior>
                                        <Button
                                            variant="ghost"
                                            className="flex w-full justify-start shadow-sm"
                                        >
                                            {opt.icon}
                                            <span className="text-start">
                                                {opt.title}
                                            </span>
                                        </Button>
                                    </Link>
                                )}
                            </>
                        ) : (
                            <div className="px-2">
                                <Separator />
                            </div>
                        )}
                    </AnimateButton>
                ))}
            </div>
        </aside>
    );
}
