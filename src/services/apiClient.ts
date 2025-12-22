  import axios from 'axios';
  import { CommonActions } from '@react-navigation/native';
  import { useAuthStore } from './store';
  import { navigationRef } from '../navigation/navigationRef';

  const instance = axios.create({
    timeout: 90000,
    withCredentials: true,
  });

  // const BaseURL = 'http://13.233.74.72:8000';
  // const BaseURL = 'https://api.parcelbuddys.com'
  const BaseURL = 'https://54c72ca97865.ngrok-free.app'

  // Request Interceptor
  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token?.access_token;
    config.baseURL = BaseURL;

    console.log('Token:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  // Response Interceptor
  instance.interceptors.response.use(
    (response) => {
      console.log('RESPONSE IN INTERCEPTOR', response);
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      console.log('ERROR IN INTERCEPTOR', error.response);

      // Prevent infinite loops
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        console.log('403 Forbidden - Trying to refresh token');

        try {
          const authState = useAuthStore.getState();
          const token = authState.token;
          const refresh_token = token?.refresh_token;


          const res = await axios.post(`${BaseURL}/auth/refresh-token/`, {
            refresh: refresh_token,
          });

          console.log('Refresh token response:', res.data);

          const newToken = {
            access_token: res.data.access,
            refresh_token: refresh_token
          };
          useAuthStore.getState().setToken(newToken);

          originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
          return instance(originalRequest);
        } catch (refreshError) {
          console.log('Refresh token failed:', refreshError);
          
          // Clear token and logout
          useAuthStore.getState().logout();
          
          // Navigate to Auth screen (Login)
          if (navigationRef.isReady()) {
            navigationRef.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Auth' as never }],
              })
            );
          }
          
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  export default instance;
