import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/config/axios.config';

export const useCmsAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Try to fetch user profile to verify authentication status
        const response = await apiClient.get('/protected/profile');
        
        // Check if user is CMS
        if (response.data.user && response.data.user.role === 'CMS') {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          // If user is not CMS, redirect to appropriate page
          setIsAuthenticated(false);
          setUser(null);
          router.push('/login');
        }
      } catch (error) {
        // If the request fails, the user is not authenticated
        setIsAuthenticated(false);
        setUser(null);
        router.push('/login');
      }
    };

    checkAuthStatus();
  }, [router]);

  return { isAuthenticated, user };
};