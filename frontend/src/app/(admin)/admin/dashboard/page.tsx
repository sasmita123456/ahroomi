"use client";
import Link from 'next/link';

import SharedDashboard from "@/components/SharedDashboard";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminDashboard() {
  const { user } = useAdminAuth();
  
  return <SharedDashboard userRole="ADMIN" />;
}
