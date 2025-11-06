import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { getOtp, verifyOtp, profileSetup } from '../services/api/auth';

export const useGetOtp = (): UseMutationResult<any, Error, { phone: string }, unknown> => {
  return useMutation({
    mutationFn: (data: { phone: string }) => getOtp(data),
  });
};

export const useVerifyOtp = (): UseMutationResult<any, Error, { phone: string; otp: string }, unknown> => {
  return useMutation({
    mutationFn: (data: { phone: string; otp: string }) => verifyOtp(data),
  });
};

export const useProfileSetup = (): UseMutationResult<any, Error, Record<string, any>, unknown> => {
  return useMutation({
    mutationFn: (data: Record<string, any>) => profileSetup(data),
  });
};

