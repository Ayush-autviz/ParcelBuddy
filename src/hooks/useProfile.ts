import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getMyProfile, getProfileById } from '../services/api/profile';
import { getContactSupport } from '../services/api/auth';

export interface ProfileData {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string | null;
  user_type?: string;
  is_kyc_verified?: boolean;
  total_rating?: number;
  is_subscribed?: boolean;
  ride_details?: {
    total_ride?: number;
    completed_ride?: number;
  };
  subscription?: {
    id?: string;
    user?: string;
    plan?: string;
    plan_price?: string;
    razorpay_subscription_id?: string | null;
    razorpay_customer_id?: string | null;
    payment_status?: string;
    start_date?: string;
    end_date?: string;
    is_active?: boolean;
    rides_used?: number;
    requests_used?: number;
    created_on?: string;
    modified_on?: string;
  };
  profile?: {
    id?: string;
    profile_photo?: string | null;
    bio?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    country?: string;
    pin_code?: string;
    preferred_language?: string;
    user?: string;
    average_rating?: number;
    date_of_birth?: string | null;
    is_kyc_verified?: boolean;
    review_count?: number;
    rides_published?: number;
    rides_completed?: number;
    is_verified?: boolean;
    verified?: boolean;
    [key: string]: any;
  };
  average_rating?: number;
  review_count?: number;
  rides_published?: number;
  rides_completed?: number;
  is_verified?: boolean;
  [key: string]: any;
}

export interface ProfileByIdResponse {
  message?: string;
  profile?: ProfileData;
}

export const useMyProfile = (): UseQueryResult<ProfileData, Error> => {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: async () => {
      const response = await getMyProfile();
      return response;
    },
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
  });
};

export const useProfileById = (
  profileId: string | undefined
): UseQueryResult<ProfileByIdResponse, Error> => {
  return useQuery({
    queryKey: ['profileById', profileId],
    queryFn: async () => {
      if (!profileId) {
        throw new Error('Profile ID is required');
      }
      const response = await getProfileById(profileId);
      // API returns { message: "...", profile: { ... } }
      return response as ProfileByIdResponse;
    },
    enabled: !!profileId, // Only fetch if profileId is provided
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
  });
};

// Contact support hook - get support email
export interface ContactSupportResponse {
  email?: string;
  [key: string]: any;
}

export const useContactSupport = (): UseQueryResult<ContactSupportResponse, Error> => {
  return useQuery({
    queryKey: ['contactSupport'],
    queryFn: async () => {
      const response = await getContactSupport();
      return response as ContactSupportResponse;
    },
    staleTime: 300000, // Cache for 5 minutes (support email doesn't change often)
    retry: 1,
  });
};
