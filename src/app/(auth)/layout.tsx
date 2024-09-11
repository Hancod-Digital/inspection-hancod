'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AuthService } from '@/services/api/auth-service';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from '@/components/animated/Spinner';

// Function to fetch user authentication status
const fetchAuthStatus = async () => {
    const service = new AuthService();
    const response = await service.isUserActive();
    return response; // Should return an object like { isAuthenticated: true/false }
};

// Main Layout Component with Protected Route
export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    // Use React Query to validate user authentication status
    const { data: authStatus, isLoading, isError } = useQuery({
        queryKey: ['authStatus'],
        queryFn: fetchAuthStatus,
        refetchOnWindowFocus: true,   // Refetch whenever the window regains focus
        refetchOnMount: true,         // Refetch every time the component is mounted
        refetchOnReconnect: true,     // Refetch when the user reconnects to the internet
    });

    useEffect(() => {
        if (!isLoading && authStatus ) {
            // If not authenticated, redirect to login page
            router.push('/dashboard');
        }
    }, [isLoading, authStatus, router]);

    // Block rendering until the authentication status is determined
    if (isLoading ) {
        return <Spinner />; // Display a loading screen until auth is confirmed
    }

    if (isError) {
        return <div>Error fetching authentication status</div>;
    }

    // Render the protected content only if authenticated
    if (!authStatus) {
        return (
            <div className="flex h-screen">
                <div className="flex w-1/2 flex-col justify-center p-32">
                    <div className="mb-8 flex items-center">
                        <img src="/images/logo.svg" alt="Logo" />
                    </div>
                    {/* Render the children (protected content) */}
                    {children}
                </div>
                <div className="relative w-1/2">
                    <img
                        alt="Construction workers reviewing plans"
                        className="object-cover h-full w-full"
                        src="/images/login/hero.svg"
                    />
                </div>
            </div>
        );
    }

    // If not authenticated, don't render anything while redirecting to login
    return <Spinner />;
} 

 