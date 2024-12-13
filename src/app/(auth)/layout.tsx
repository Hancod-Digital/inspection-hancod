'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AuthService } from '@/services/api/auth-service';
import Spinner from '@/components/animated/Spinner';

const fetchAuthStatus = async () => {
    const service = new AuthService();
    const response = await service.isUserActive();
    return response;  
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();  // Use usePathname instead of useRouter().pathname

    const { data: authStatus, isLoading, isError } = useQuery({
        queryKey: ['authStatus'],
        queryFn: fetchAuthStatus,
        refetchOnWindowFocus: true,    
        refetchOnMount: true,         
        refetchOnReconnect: true,
    });

    useEffect(() => {
        if (!isLoading && authStatus && pathname !== '/new-password') {
            // Redirect to dashboard if authenticated and not on /new-password
            router.push('/dashboard');
        }
    }, [isLoading, authStatus, router, pathname]);

    if (isLoading) {
        return <Spinner />;
    }

    if (isError) {
        return <div>Error fetching authentication status</div>;
    }

    // Check if user is not authenticated, or if they are on the /new-password page
    if (!authStatus || pathname === '/new-password') {
        return (
            <div className="flex h-screen overflow-hidden">
            {/* Left Section */}
            <div className="flex w-1/2 flex-col justify-center p-8 md:p-16 lg:p-32">
              <div className="mb-8 flex items-center">
                <img src="/images/logo.svg" alt="Logo" className="h-12 w-auto" />
              </div>
              <div className="flex-1 overflow-auto">
                {children}
              </div>
            </div>
          
            {/* Right Section */}
            <div className="relative w-1/2 h-full">
              <img
                alt="Construction workers reviewing plans"
                className="object-cover w-full h-full"
                src="/images/login/hero.svg"
              />
            </div>
          </div>
          
        );
    }

    return <Spinner />;
}
