import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getMyProfile } from '../services/api/profile';

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
    [key: string]: any;
  };
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
