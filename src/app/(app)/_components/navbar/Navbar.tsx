import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { Menu, MenuItem } from '@/components/animated/DropDown';
import { AuthService, fetchUserActiveStatus, fetchUserDetails } from '@/services/api/auth-service';
import { makeApiCall } from '@/lib/apicaller';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@/components/animated/Spinner';
import Link from 'next/link';



export default function Component() {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    // Using React Query to fetch user active status with object syntax (v5+)
    const { data: userDetails, isLoading, isError } = useQuery({
        queryKey: ['userDetails'],
        queryFn: fetchUserDetails,
    });
   
     

    const userName = userDetails?.name != "" ? userDetails?.name : userDetails?.email?.split('@')[0] ;
   console.log(userDetails);
   
     
    const userEmail = userDetails?.email;
    const fallbackAvatar = generateFallbackAvatar(userName);

    const handleLogout = () => {
        const service = new AuthService();
        makeApiCall(
            () => service.userLogout(),
            {
                toastContent: "Logout Successful",
                toast,
                afterSuccess: () => {
                    router.push('/login');
                    router.refresh();
                },
            }
        );
    };

    if (isLoading) return <Spinner />;
    if (isError) return <div>Error loading user data</div>;

    return (
        <header className="flex h-16 px-10 items-center justify-between border-b bg-white">
            <div className="flex items-center gap-4">
                <img src="/images/logo.svg" alt="" />
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage alt={`${userName}'s avatar`} src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>{fallbackAvatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{userName}</span>
                        <span className="text-xs text-gray-500">{userEmail}</span>
                    </div>
                    <Menu
                        label="Options"
                        open={open}
                        setOpen={setOpen}
                        component={<ChevronDown className="h-4 w-4 text-gray-500" />}
                    >
                        <Link href="/profile"><MenuItem>Profile</MenuItem></Link>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </div>
            </div>
        </header>
    );
}

// Helper function to generate fallback avatar from user's name
export function generateFallbackAvatar(name: string | undefined) {
    if (!name) return "";
    return name
        .split(" ")
        .map((word: string) => word.charAt(0).toUpperCase())
        .join("");
}
