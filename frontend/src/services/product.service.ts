import apiClient from '../config/axios.config';
import { StandardResponse } from '../types/api.types';

// Define the product data interface
export interface ProductImageData {
  thumbnail?: string;
  longImage?: string;
  alt?: string;
  title?: string;
  // Removed productId since it's not needed
}

export interface ProductData {
  productName: string;
  productSlug: string;
  category: string; // Category ID
  tags: string[];
  shortDescription?: string;
  longDescription?: string;
  sku: string;
  images?: ProductImageData[];
  isActive?: boolean;
}

export interface ProductResponse {
  _id: string;
  productName: string;
  productSlug: string;
  category: {
    _id: string;
    categoryName: string;
  };
  tags: string[];
  shortDescription?: string;
  longDescription?: string;
  sku: string;
  images?: ProductImageData[];
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryOption {
  _id: string;
  categoryName: string;
}

export const productService = {
  addProduct: async (data: ProductData, thumbnail?: File, longImage?: File): Promise<StandardResponse<ProductResponse>> => {
    const formData = new FormData();
    
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
      formData.append('thumbnail_alt', data.images && data.images[0] ? data.images[0].alt || '' : '');
      formData.append('thumbnail_title', data.images && data.images[0] ? data.images[0].title || '' : '');
    }
    if (longImage) {
      formData.append('longImage', longImage);
      formData.append('longImage_alt', data.images && data.images[1] ? data.images[1].alt || '' : '');
      formData.append('longImage_title', data.images && data.images[1] ? data.images[1].title || '' : '');
    }
    
    formData.append('data', JSON.stringify(data));
    
    const response = await apiClient.post<StandardResponse<ProductResponse>>('/product/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  addProductEncrypted: async (
    encryptedData: string, 
    iv: string, 
    thumbnail?: File, 
    longImage?: File,
    thumbnailAlt?: string,
    thumbnailTitle?: string,
    longImageAlt?: string,
    longImageTitle?: string
  ): Promise<StandardResponse<ProductResponse>> => {
    const formData = new FormData();
    
    // Append files if provided
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
      formData.append('thumbnail_alt', thumbnailAlt || '');
      formData.append('thumbnail_title', thumbnailTitle || '');
    }
    if (longImage) {
      formData.append('longImage', longImage);
      formData.append('longImage_alt', longImageAlt || '');
      formData.append('longImage_title', longImageTitle || '');
    }
    
    // Append encrypted data
    formData.append('encryptedData', encryptedData);
    formData.append('iv', iv);
    
    const response = await apiClient.post<StandardResponse<ProductResponse>>('/product/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all products
  getAllProducts: async (): Promise<StandardResponse<ProductResponse[]>> => {
    const response = await apiClient.get<StandardResponse<ProductResponse[]>>('/product/all');
    return response.data;
  },

  // Get only active products
  getActiveProducts: async (): Promise<StandardResponse<ProductResponse[]>> => {
    const response = await apiClient.get<StandardResponse<ProductResponse[]>>('/product/active');
    return response.data;
  },

  // Get all categories for dropdown
  getAllCategories: async (): Promise<StandardResponse<CategoryOption[]>> => {
    const response = await apiClient.get<StandardResponse<CategoryOption[]>>('/product/categories');
    return response.data;
  },

  // Get only active categories for dropdown
  getActiveCategories: async (): Promise<StandardResponse<CategoryOption[]>> => {
    const response = await apiClient.get<StandardResponse<CategoryOption[]>>('/category/active');
    return response.data;
  },

  // Get a single product by ID
  getProductById: async (id: string): Promise<StandardResponse<ProductResponse>> => {
    const response = await apiClient.get<StandardResponse<ProductResponse>>(`/product/${id}`);
    return response.data;
  },

  // Update a product by ID
  updateProduct: async (id: string, data: any): Promise<StandardResponse<ProductResponse>> => {
    // Check if data is FormData
    if (data instanceof FormData) {
      // Directly send FormData
      const response = await apiClient.put<StandardResponse<ProductResponse>>(`/product/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
    // Check if we're sending encrypted data
    else if (data.encryptedData && data.iv) {
      // Send as form data for encrypted payload
      const formData = new FormData();
      formData.append('encryptedData', data.encryptedData);
      formData.append('iv', data.iv);
      
      // Append files if provided
      if (data.thumbnail) {
        formData.append('thumbnail', data.thumbnail);
        formData.append('thumbnail_alt', data.thumbnailAlt || '');
        formData.append('thumbnail_title', data.thumbnailTitle || '');
      }
      if (data.longImage) {
        formData.append('longImage', data.longImage);
        formData.append('longImage_alt', data.longImageAlt || '');
        formData.append('longImage_title', data.longImageTitle || '');
      }
      
      // Append existing images updates if provided
      if (data.existingImages) {
        formData.append('existingImages', data.existingImages);
      }
      
      // Append replacement indices if provided
      if (data.replaceThumbnailIndex !== undefined) {
        formData.append('replaceThumbnailIndex', data.replaceThumbnailIndex.toString());
      }
      if (data.replaceLongImageIndex !== undefined) {
        formData.append('replaceLongImageIndex', data.replaceLongImageIndex.toString());
      }
      
      const response = await apiClient.put<StandardResponse<ProductResponse>>(`/product/${id}`, formData, {
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
        formData.append('thumbnail_alt', data.thumbnailAlt || '');
        formData.append('thumbnail_title', data.thumbnailTitle || '');
      }
      if (data.longImage) {
        formData.append('longImage', data.longImage);
        formData.append('longImage_alt', data.longImageAlt || '');
        formData.append('longImage_title', data.longImageTitle || '');
      }
      
      // Append existing images updates if provided
      if (data.existingImages) {
        formData.append('existingImages', data.existingImages);
      }
      
      // Append replacement indices if provided
      if (data.replaceThumbnailIndex !== undefined) {
        formData.append('replaceThumbnailIndex', data.replaceThumbnailIndex.toString());
      }
      if (data.replaceLongImageIndex !== undefined) {
        formData.append('replaceLongImageIndex', data.replaceLongImageIndex.toString());
      }
      
      const response = await apiClient.put<StandardResponse<ProductResponse>>(`/product/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Send as JSON for regular updates
      const response = await apiClient.put<StandardResponse<ProductResponse>>(`/product/${id}`, data);
      return response.data;
    }
  },

  // Delete a product by ID
  deleteProduct: async (id: string): Promise<StandardResponse<ProductResponse>> => {
    const response = await apiClient.delete<StandardResponse<ProductResponse>>(`/product/${id}`);
    return response.data;
  },

  // Upload images to an existing product
  uploadProductImages: async (
    productId: string,
    thumbnail?: File,
    longImage?: File[],
    thumbnailAlt?: string,
    thumbnailTitle?: string,
    longImageAlt?: string,
    longImageTitle?: string
  ): Promise<StandardResponse<ProductResponse>> => {
    const formData = new FormData();
    
    // Append files if provided
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
      formData.append('thumbnail_alt', thumbnailAlt || '');
      formData.append('thumbnail_title', thumbnailTitle || '');
    }
    
    // Handle multiple long images
    if (longImage && longImage.length > 0) {
      longImage.forEach((image, index) => {
        formData.append('longImage', image);
      });
      formData.append('longImage_alt', longImageAlt || '');
      formData.append('longImage_title', longImageTitle || '');
    }
    
    const response = await apiClient.post<StandardResponse<ProductResponse>>(`/product/${productId}/upload-images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default productService;
