'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@fontsource/roboto"; // Defaults to weight 400
import "@fontsource/roboto/400.css"; // Specify weight
import "@fontsource/roboto/400-italic.css"; // Specify weight and style
import { LoadingProvider } from "@/context/LoadingContext";

import { Toaster } from "@/components/ui/toaster";
import ReduxProvider from "@/redux/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

  
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create a new QueryClient instance, only once
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body style={{ fontFamily: "roboto" }} className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ReduxProvider>
          <LoadingProvider>
            {children}  </LoadingProvider>
          </ReduxProvider>
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
