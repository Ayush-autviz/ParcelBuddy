import axios from 'axios';
import { useAuthStore } from './store';

const instance = axios.create({
  timeout: 90000,
  withCredentials: true,
});

const BaseURL = 'http://13.233.74.72:8000';

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
// instance.interceptors.response.use(
//   (response) => {
//     console.log('RESPONSE IN INTERCEPTOR', response);
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // Prevent infinite loops
//     if (error.response?.status === 403 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       console.log('403 Forbidden - Trying to refresh token');

//       try {
//         const authState = useAuthStore.getState();
//         const token = authState.token;
//         const refresh_token = token?.refresh_token;
//         const username = authState.user?.username;



//         const res = await axios.post(`${BaseURL}/auth/cognito/refresh/`, {
//           refresh_token,
//           username,
//         });

//         console.log('Refresh token response:', res.data);

//         const newToken = {
//           access_token: res.data.access_token,
//           refresh_token: res.data.refresh_token || refresh_token,
//         };
//         useAuthStore.getState().setToken(newToken);

//         originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
//         return instance(originalRequest);
//       } catch (refreshError) {
//         console.log('Refresh token failed:', refreshError);
//         useAuthStore.getState().logout();
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default instance;
