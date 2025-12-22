import apiClient from "../apiClient";
import publicApiClient from "../publicApiClient";

// get otp (phone) - COMMENTED OUT, using email OTP instead
// export const getOtp = async (data: any) => {
//   console.log('data', data);
//   const response = await apiClient.post('/auth/request-otp/', data);
//   return response.data;
// };

// verify otp (phone) - COMMENTED OUT, using email OTP instead
// export const verifyOtp = async (data: any) => {
//   console.log('data', data);
//   const response = await apiClient.post('/auth/verify-otp/', data);
//   return response.data;
// };

// get otp for email
export const getOtpEmail = async (data: { email: string }) => {
  console.log('data', data);
  const response = await publicApiClient.post('/auth/request-otp-email/', data);
  return response.data;
};

// verify otp for email
export const verifyOtpEmail = async (data: { email: string; otp: string }) => {
  console.log('data', data);
  const response = await publicApiClient.post('/auth/verify-otp-email/', data);
  return response.data;
};

// resend otp for email
export const resendOtpEmail = async (data: { email: string }) => {
  console.log('data', data);
  const response = await publicApiClient.post('/auth/resend-otp-email/', data);
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

// get country by coordinates
export const getCountryByCoordinates = async (lat: string, lon: string) => {
  const formData = new FormData();
  formData.append('lat', lat);
  formData.append('lon', lon);
  
  const response = await apiClient.post('/auth/get-country/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// get country (legacy - for backward compatibility)
export const getCountry = async () => {
  const response = await apiClient.get('/auth/get-country/');
  return response.data;
};

// get plans
export const getPlans = async (region?: string) => {
  const url = region ? `/auth/plans/?region=${region}` : '/auth/plans/';
  const response = await apiClient.get(url);
  return response.data;
};

// send fcm token
export const sendFcmToken = async (data: any) => {
  const response = await apiClient.post('/notifications/fcm-token/', data);
  return response.data;
};

// google login
export const googleLogin = async (data: { token: string }) => {
  const response = await publicApiClient.post('/auth/google-login/', data);
  return response.data;
};

// password management
export const createPassword = async (data: { email: string; password: string; confirm_password: string }) => {
  console.log('data', data);
  const response = await publicApiClient.post('/auth/create-password/', data);
  return response.data;
};

export const loginEmail = async (data: { email: string; password: string }) => {
  console.log('data', data);
  const response = await publicApiClient.post('/auth/login-email/', data);
  return response.data;
};

export const forgotPassword = async (data: { email: string }) => {
  console.log('data', data);
  const response = await publicApiClient.post('/auth/forgot-password/', data);
  return response.data;
};

export const verifyResetOtp = async (data: { email: string; otp: string }) => {
  console.log('data', data);
  const response = await publicApiClient.post('/auth/verify-reset-otp/', data);
  return response.data;
};

export const resetPassword = async (data: { email: string; otp: string; new_password: string; confirm_password: string }) => {
  console.log('data', data);
  const response = await publicApiClient.post('/auth/reset-password/', data);
  return response.data;
};

// contact support - get support email
export const getContactSupport = async () => {
  const response = await publicApiClient.get('/auth/contact-support/');
  return response.data;
};