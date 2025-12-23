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
const BaseURL = 'https://c20fa334cb66.ngrok-free.app'

// Request Interceptor
instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token?.access_token;
  config.baseURL = BaseURL;


  return config;
});

export default instance;
