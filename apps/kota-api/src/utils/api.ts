import axios from 'axios';
import { API_CONFIG } from '../config/constants';

/**
 * Configured axios instance for FakeStore API calls
 */
export const fakeStoreApi = axios.create({
  baseURL: API_CONFIG.FAKE_STORE_API,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generic error handler for API requests
 */
export const handleApiError = (error: any, defaultMessage: string) => {
  console.error(`API Error: ${defaultMessage}`, error);
  
  if (axios.isAxiosError(error) && error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || defaultMessage,
      error: error.response.data
    };
  }
  
  return {
    status: 500,
    message: defaultMessage,
    error: error.message || 'Unknown error'
  };
};