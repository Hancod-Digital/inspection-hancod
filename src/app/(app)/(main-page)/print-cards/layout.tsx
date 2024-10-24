'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { SubtopicProvider } from '@/context/SubtopicContext';
import { getSubTopic } from '@/lib/utils';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
 console.log("hi");
 

  return (
    <SubtopicProvider subtopic={"student_credentials"}>
      {children}
    </SubtopicProvider>
  );
}
