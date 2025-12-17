import apiClient from '../config/axios.config';
import { StandardResponse } from '../types/api.types';

interface CmsLoginData {
  username: string;
  password: string;
}

interface AdminLoginData {
  email: string;
  password: string;
}

interface OtpVerificationData {
  email: string;
  otp: string;
}

// Secure login data interface for encrypted payload
interface SecureCmsLoginData {
  encryptedData: string;
  iv: string;
}

// Encrypted payload interfaces
interface EncryptedAdminLoginData {
  encryptedData: string;
  iv: string;
}

interface EncryptedOtpVerificationData {
  encryptedData: string;
  iv: string;
}

export const authService = {
  cmsLogin: async (data: CmsLoginData): Promise<StandardResponse> => {
    const response = await apiClient.post<StandardResponse>('/auth/cms-login', data);
    return response.data;
  },

  adminLogin: async (data: AdminLoginData | EncryptedAdminLoginData): Promise<StandardResponse> => {
    const response = await apiClient.post<StandardResponse>('/auth/admin-login', data);
    return response.data;
  },

  verifyOtp: async (data: OtpVerificationData | EncryptedOtpVerificationData): Promise<StandardResponse> => {
    const response = await apiClient.post<StandardResponse>('/auth/verify-otp', data);
    return response.data;
  },

  // Secure CMS login that encrypts credentials before sending
  secureCmsLogin: async (data: SecureCmsLoginData): Promise<StandardResponse> => {
    const response = await apiClient.post<StandardResponse>('/auth/secure-cms-login', data);
    return response.data;
  },

  logout: async (): Promise<StandardResponse> => {
    const response = await apiClient.post<StandardResponse>('/auth/logout');
    return response.data;
  }
};