import { getMyProfile } from '../services/api/profile';
import { useAuthStore } from '../services/store';

/**
 * Fetches the user's profile and updates the auth store
 * This is a reusable function that can be called from anywhere
 * @returns Promise with the profile data or null if error
 */
export const fetchAndUpdateProfile = async (): Promise<any | null> => {
  try {
    const { setUser } = useAuthStore.getState();
    const profileData = await getMyProfile();
    console.log('profileData fetched and updated');
    if (profileData) {
      setUser(profileData);
      return profileData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching and updating profile:', error);
    return null;
  }
};

