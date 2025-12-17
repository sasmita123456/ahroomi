"use client";

import { ReactNode, useState } from "react";
import SharedSidebar from "@/components/SharedSidebar";
import SharedHeader from "@/components/SharedHeader";
import { useCmsAuth } from "@/hooks/useCmsAuth";

interface CmsLayoutProps {
  children: ReactNode;
}

export default function CmsLayout({ children }: CmsLayoutProps) {
  const { isAuthenticated, user } = useCmsAuth();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SharedSidebar isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} userRole="CMS" />

      <div className="flex flex-col flex-1">
        <SharedHeader toggleSidebar={() => setIsOpen(!isOpen)} user={user} userRole="CMS" />
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}