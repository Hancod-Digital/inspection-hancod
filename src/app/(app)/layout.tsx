'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query"; 
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "./_components/navbar/Navbar";
import { AuthService } from "@/services/api/auth-service";
import Spinner from "@/components/animated/Spinner";
import { useLoading } from '@/context/LoadingContext'; // Import loading context

// Function to fetch user authentication status
const fetchAuthStatus = async () => {
    const service = new AuthService();
    const response = await service.isUserActive();
    return response; // Should return an object like { isAuthenticated: true/false }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isLoadingOne: contextLoading, setLoading } = useLoading(); // Rename `isLoadingOne` to `contextLoading`



    // Use React Query to validate user authentication status
    const { data: authStatus, isLoading, isError } = useQuery({
        queryKey: ['authStatus'],
        queryFn: fetchAuthStatus,
        refetchOnWindowFocus: true,   // Refetch whenever the window regains focus
        refetchOnMount: true,         // Refetch every time the component is mounted
        refetchOnReconnect: true,     // Refetch when the user reconnects to the internet
    });

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !authStatus) {
            router.push("/login");
        }
    }, [isLoading, authStatus, router]);

    // Block rendering until the authentication status is determined
    if (isLoading || !authStatus) {
        return <Spinner />; // Display loading state while checking auth
    }

    if (isError) {
        return <div>Error fetching authentication status</div>;
    }

    // Render protected content only if authenticated
    return (
        <>
            <Navbar />
            <div className="flex relative leading-loose">
                <Sidebar /> 
                {contextLoading ? <Spinner /> : <div className="pt-16 w-full">{children}</div>} {/* Display spinner based on context loading */}
            </div>
        </>
    );
}
