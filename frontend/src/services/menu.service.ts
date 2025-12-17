import apiClient from '../config/axios.config';
import { StandardResponse } from '../types/api.types';

export interface MenuItem {
  _id: string;
  name: string;
  link: string;
  icon?: string;
  parentId: string | null;
  order: number;
  isActive: boolean;
  roles: string[];
  children?: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export const menuService = {
  // Get menus by role
  getMenusByRole: async (role: 'ADMIN' | 'CMS' | 'USER'): Promise<StandardResponse<MenuItem[]>> => {
    try {
      const response = await apiClient.get<StandardResponse<MenuItem[]>>(`/menu/${role}/menus`);
      return response.data;
    } catch (error) {
      console.error('Error fetching menus by role:', error);
      throw error;
    }
  },

  // Admin menu management
  getAllMenus: async (): Promise<StandardResponse<MenuItem[]>> => {
    try {
      const response = await apiClient.get<StandardResponse<MenuItem[]>>('/menu');
      return response.data;
    } catch (error) {
      console.error('Error fetching all menus:', error);
      throw error;
    }
  },

  createMenu: async (data: Partial<MenuItem>): Promise<StandardResponse<MenuItem>> => {
    try {
      const response = await apiClient.post<StandardResponse<MenuItem>>('/menu', data);
      return response.data;
    } catch (error) {
      console.error('Error creating menu:', error);
      throw error;
    }
  },

  createMenuEncrypted: async (encryptedData: string, iv: string): Promise<StandardResponse<MenuItem>> => {
    try {
      const response = await apiClient.post<StandardResponse<MenuItem>>('/menu', {
        encryptedData,
        iv
      });
      return response.data;
    } catch (error) {
      console.error('Error creating menu with encryption:', error);
      throw error;
    }
  },

  updateMenu: async (id: string, data: Partial<MenuItem>): Promise<StandardResponse<MenuItem>> => {
    try {
      const response = await apiClient.put<StandardResponse<MenuItem>>(`/menu/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating menu:', error);
      throw error;
    }
  },

  updateMenuEncrypted: async (id: string, encryptedData: string, iv: string): Promise<StandardResponse<MenuItem>> => {
    try {
      const response = await apiClient.put<StandardResponse<MenuItem>>(`/menu/${id}`, {
        encryptedData,
        iv
      });
      return response.data;
    } catch (error) {
      console.error('Error updating menu with encryption:', error);
      throw error;
    }
  },

  deleteMenu: async (id: string): Promise<StandardResponse<null>> => {
    try {
      const response = await apiClient.delete<StandardResponse<null>>(`/menu/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting menu:', error);
      throw error;
    }
  },

  toggleMenuStatus: async (id: string): Promise<StandardResponse<MenuItem>> => {
    try {
      const response = await apiClient.patch<StandardResponse<MenuItem>>(`/menu/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error('Error toggling menu status:', error);
      throw error;
    }
  }
};