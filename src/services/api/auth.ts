import apiClient from "../apiClient";

// get otp
export const getOtp = async (data: any) => {
  console.log('data', data);
  const response = await apiClient.post('/auth/request-otp/', data);
  return response.data;
};

// verify otp
export const verifyOtp = async (phone: string, otp: string) => {
  const response = await apiClient.post('/auth/verify-otp/', { phone, otp });
  return response.data;
};

// profile setup
export const profileSetup = async (data: any) => {
  const response = await apiClient.post('/auth/profile-setup/', data);
  return response.data;
};