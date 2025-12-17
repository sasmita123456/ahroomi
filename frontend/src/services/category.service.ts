import apiClient from '../config/axios.config';
import { StandardResponse } from '../types/api.types';

// Define the simplified category data interface (without SEO fields)
export interface CategoryData {
  categoryName: string;
  slug: string;
  // parentCategory?: string;
  shortDesc?: string;
  longDesc?: string;
  thumbnail?: string;
  banner?: string;
  isActive?: boolean;
}

export interface CategoryResponse {
  _id: string;
  categoryName: string;
  slug: string;
  // parentCategory?: string;
  shortDesc?: string;
  longDesc?: string;
  thumbnail?: string;
  banner?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const categoryService = {
  addCategory: async (data: CategoryData, thumbnail?: File, banner?: File): Promise<StandardResponse<CategoryResponse>> => {
    const formData = new FormData();
    
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }
    if (banner) {
      formData.append('banner', banner);
    }
    
    formData.append('data', JSON.stringify(data));
    
    const response = await apiClient.post<StandardResponse<CategoryResponse>>('/category/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  addCategoryEncrypted: async (
    encryptedData: string, 
    iv: string, 
    thumbnail?: File, 
    banner?: File
  ): Promise<StandardResponse<CategoryResponse>> => {
    const formData = new FormData();
    
    // Append files if provided
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }
    if (banner) {
      formData.append('banner', banner);
    }
    
    // Append encrypted data
    formData.append('encryptedData', encryptedData);
    formData.append('iv', iv);
    
    const response = await apiClient.post<StandardResponse<CategoryResponse>>('/category/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all categories
  getAllCategories: async (): Promise<StandardResponse<CategoryResponse[]>> => {
    const response = await apiClient.get<StandardResponse<CategoryResponse[]>>('/category/all');
    return response.data;
  },

  // Get only active categories
  getActiveCategories: async (): Promise<StandardResponse<CategoryResponse[]>> => {
    const response = await apiClient.get<StandardResponse<CategoryResponse[]>>('/category/active');
    return response.data;
  },

  // Get a single category by ID
  getCategoryById: async (id: string): Promise<StandardResponse<CategoryResponse>> => {
    const response = await apiClient.get<StandardResponse<CategoryResponse>>(`/category/${id}`);
    return response.data;
  },

  // Update a category by ID
  updateCategory: async (id: string, data: any): Promise<StandardResponse<CategoryResponse>> => {
    // Check if we're sending encrypted data
    if (data.encryptedData && data.iv) {
      // Send as form data for encrypted payload
      const formData = new FormData();
      formData.append('encryptedData', data.encryptedData);
      formData.append('iv', data.iv);
      
      // Append files if provided
      if (data.thumbnail) {
        formData.append('thumbnail', data.thumbnail);
      }
      if (data.banner) {
        formData.append('banner', data.banner);
      }
      
      const response = await apiClient.put<StandardResponse<CategoryResponse>>(`/category/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else if (data.data) {
      // Send as form data with regular data
      const formData = new FormData();
      formData.append('data', typeof data.data === 'string' ? data.data : JSON.stringify(data.data));
      
      // Append files if provided
      if (data.thumbnail) {
        formData.append('thumbnail', data.thumbnail);
      }
      if (data.banner) {
        formData.append('banner', data.banner);
      }
      
      const response = await apiClient.put<StandardResponse<CategoryResponse>>(`/category/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Send as JSON for regular updates
      const response = await apiClient.put<StandardResponse<CategoryResponse>>(`/category/${id}`, data);
      return response.data;
    }
  },

  // Delete a category by ID
  deleteCategory: async (id: string): Promise<StandardResponse<CategoryResponse>> => {
    const response = await apiClient.delete<StandardResponse<CategoryResponse>>(`/category/${id}`);
    return response.data;
  }
};