"use client";

import SharedDashboard from "@/components/SharedDashboard";
import { useCmsAuth } from "@/hooks/useCmsAuth";

export default function CmsDashboard() {
  const { user } = useCmsAuth();
  
  return <SharedDashboard userRole="CMS" />;
}