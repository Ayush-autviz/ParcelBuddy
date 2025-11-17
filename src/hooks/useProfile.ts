import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getMyProfile, getProfileById } from '../services/api/profile';

export interface ProfileData {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string | null;
  user_type?: string;
  profile?: {
    profile_photo?: string;
    bio?: string;
    average_rating?: number;
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
): UseQueryResult<ProfileData, Error> => {
  return useQuery({
    queryKey: ['profileById', profileId],
    queryFn: async () => {
      if (!profileId) {
        throw new Error('Profile ID is required');
      }
      const response = await getProfileById(profileId);
      return response;
    },
    enabled: !!profileId, // Only fetch if profileId is provided
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
  });
};
