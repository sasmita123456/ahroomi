import { useState } from 'react';
import { authService } from '@/services/auth.service';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.logout();
      window.location.href = '/login';
    } catch (err: any) {
      setError(err.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
    error
  };
};