import apiClient from "../apiClient";

// get otp
export const getOtp = async (data: any) => {
  console.log('data', data);
  const response = await apiClient.post('/auth/request-otp/', data);
  return response.data;
};

// verify otp
export const verifyOtp = async (data: any) => {
  console.log('data', data);
  const response = await apiClient.post('/auth/verify-otp/', data);
  return response.data;
};

// profile setup
export const profileSetup = async (data: FormData) => {
  const response = await apiClient.put('/auth/profile-setup/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// get country
export const getCountry = async () => {
  const response = await apiClient.get('/auth/get-country/');
  return response.data;
};

// get plans
export const getPlans = async () => {
  const response = await apiClient.get(`/auth/plans/`);
  return response.data;
};