"use client";

import SharedHeader from "@/components/SharedHeader";

interface HeaderProps {
  toggleSidebar: () => void;
  user?: any;
}

export default function Header({ toggleSidebar, user }: HeaderProps) {
  return <SharedHeader toggleSidebar={toggleSidebar} user={user} userRole="ADMIN" />;
}
