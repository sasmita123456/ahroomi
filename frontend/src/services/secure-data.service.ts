import apiClient from '../config/axios.config';
import { prepareEncryptedPayload } from '../utils/encryption';

/**
 * Service for submitting sensitive data securely
 */
class SecureDataService {
  /**
   * Submit sensitive data with automatic encryption
   * @param data The data to submit
   * @param sensitiveFields Fields that should be encrypted
   * @returns API response
   */
  static async submitSensitiveData(data: any, sensitiveFields: string[] = []) {
    try {
      // Prepare the payload with encryption metadata
      // The backend will automatically encrypt these fields
      const payload = prepareEncryptedPayload(data, sensitiveFields);
      
      // Send to backend - encryption happens automatically on the server
      const response = await apiClient.post('/secure/submit-sensitive-data', payload);
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit sensitive data');
    }
  }
}

export default SecureDataService;