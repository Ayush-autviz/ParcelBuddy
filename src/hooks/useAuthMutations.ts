import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { 
  getOtpEmail, 
  verifyOtpEmail, 
  resendOtpEmail, 
  profileSetup, 
  sendFcmToken, 
  googleLogin,
  createPassword,
  loginEmail,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  requestKycPhoneOtp,
  verifyKycPhoneOtp
} from '../services/api/auth';

// Phone OTP hooks - COMMENTED OUT, using email OTP instead
// export const useGetOtp = (): UseMutationResult<any, Error, { phone: string }, unknown> => {
//   return useMutation({
//     mutationFn: (data: { phone: string }) => getOtp(data),
//   });
// };

// export const useVerifyOtp = (): UseMutationResult<any, Error, { phone: string; otp: string }, unknown> => {
//   return useMutation({
//     mutationFn: (data: { phone: string; otp: string }) => verifyOtp(data),
//   });
// };

// Email OTP hooks
export const useGetOtpEmail = (): UseMutationResult<any, Error, { email: string }, unknown> => {
  return useMutation({
    mutationFn: (data: { email: string }) => getOtpEmail(data),
  });
};

export const useVerifyOtpEmail = (): UseMutationResult<any, Error, { email: string; otp: string }, unknown> => {
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) => verifyOtpEmail(data),
  });
};

export const useResendOtpEmail = (): UseMutationResult<any, Error, { email: string }, unknown> => {
  return useMutation({
    mutationFn: (data: { email: string }) => resendOtpEmail(data),
  });
};

export const useProfileSetup = (): UseMutationResult<any, Error, FormData, unknown> => {
  return useMutation({
    mutationFn: (data: FormData) => profileSetup(data),
  });
};

export const useSendFcmToken = (): UseMutationResult<any, Error, { token: string; device_type: string }, unknown> => {
  return useMutation({
    mutationFn: (data: { token: string; device_type: string }) => sendFcmToken(data),
  });
};

export const useGoogleLogin = (): UseMutationResult<any, Error, { token: string }, unknown> => {
  return useMutation({
    mutationFn: (data: { token: string }) => googleLogin(data),
  });
};

// Password management hooks
export const useCreatePassword = (): UseMutationResult<any, Error, { email: string; password: string; confirm_password: string }, unknown> => {
  return useMutation({
    mutationFn: (data: { email: string; password: string; confirm_password: string }) => createPassword(data),
  });
};

export const useLoginEmail = (): UseMutationResult<any, Error, { email: string; password: string }, unknown> => {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => loginEmail(data),
  });
};

export const useForgotPassword = (): UseMutationResult<any, Error, { email: string }, unknown> => {
  return useMutation({
    mutationFn: (data: { email: string }) => forgotPassword(data),
  });
};

export const useVerifyResetOtp = (): UseMutationResult<any, Error, { email: string; otp: string }, unknown> => {
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) => verifyResetOtp(data),
  });
};

export const useResetPassword = (): UseMutationResult<any, Error, { email: string; otp: string; new_password: string; confirm_password: string }, unknown> => {
  return useMutation({
    mutationFn: (data: { email: string; otp: string; new_password: string; confirm_password: string }) => resetPassword(data),
  });
};

// KYC phone OTP hooks
export const useRequestKycPhoneOtp = (): UseMutationResult<any, Error, { phone: string }, unknown> => {
  return useMutation({
    mutationFn: (data: { phone: string }) => requestKycPhoneOtp(data),
  });
};

export const useVerifyKycPhoneOtp = (): UseMutationResult<any, Error, { otp: string }, unknown> => {
  return useMutation({
    mutationFn: (data: { otp: string }) => verifyKycPhoneOtp(data),
  });
};

