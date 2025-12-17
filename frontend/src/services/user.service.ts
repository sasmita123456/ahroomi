import apiClient from '../config/axios.config';

export const userService = {
  getProfile: async () => {
    const response = await apiClient.get('/protected/profile');
    return response.data;
  },

  updateProfile: async (data: any) => {
    try {
      const response = await apiClient.put('/user/profile', data);
      return response.data;
    } catch (error: any) {
      // Propagate the error so it can be handled by the calling function
      throw error;
    }
  }
};