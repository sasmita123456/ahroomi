"use client";

import SharedSidebar from "@/components/SharedSidebar";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

export default function Sidebar({ isOpen, toggle }: SidebarProps) {
  return <SharedSidebar isOpen={isOpen} toggle={toggle} userRole="CMS" />;
}
