import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://api.example.com', // Replace with your API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, logging, etc.
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Add authorization token if available
    const token = getAuthToken(); // You'll need to implement this
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (__DEV__) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common responses/errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log responses in development
    if (__DEV__) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      const { status, data } = error.response;

      // Handle unauthorized access
      if (status === 401) {
        // Clear auth token and redirect to login
        clearAuthToken();
        // You might want to navigate to login screen here
        console.log('Unauthorized - redirecting to login');
      }

      // Handle server errors
      if (status >= 500) {
        console.error('Server error:', data);
      }

      // Handle rate limiting
      if (status === 429) {
        console.warn('Rate limited - please wait before retrying');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.request);
    } else {
      // Other error
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Helper functions for token management
const getAuthToken = (): string | null => {
  // Implement your token retrieval logic here
  // This could be from AsyncStorage, SecureStore, etc.
  return null; // Replace with actual implementation
};

const clearAuthToken = (): void => {
  // Implement your token clearing logic here
  // Remove token from storage
};

// Export the configured axios instance
export default apiClient;

// Export additional utilities
export const apiEndpoints = {
  // Define your API endpoints here
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
  },
  parcels: {
    list: '/parcels',
    create: '/parcels',
    update: (id: string) => `/parcels/${id}`,
    delete: (id: string) => `/parcels/${id}`,
  },
  user: {
    profile: '/user/profile',
    updateProfile: '/user/profile',
  },
};
