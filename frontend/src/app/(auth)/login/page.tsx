"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginTabs from "./components/LoginTabs";
import apiClient from "@/config/axios.config";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuthStatus = async () => {
      try {
        // Try to fetch user profile to verify authentication status
        const response = await apiClient.get("/protected/profile");
        // If successful, redirect to appropriate dashboard based on role
        // Adding a small delay to prevent flashing
        setTimeout(() => {
          if (response.data.user && response.data.user.role === 'ADMIN') {
            router.push("/admin/dashboard");
          } else if (response.data.user && response.data.user.role === 'CMS') {
            router.push("/cms/dashboard");
          } else {
            router.push("/login");
          }
        }, 100);
      } catch (error) {
        // If the request fails, the user is not authenticated
        // Stay on login page
      }
    };

    checkAuthStatus();
  }, [router]);

  return <LoginTabs />;
}