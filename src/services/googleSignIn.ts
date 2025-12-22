import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

// Configure Google Sign-In
// Note: You'll need to add your webClientId from GoogleService-Info.plist or google-services.json
// For iOS: Get it from GoogleService-Info.plist -> CLIENT_ID
// For Android: Get it from google-services.json -> client -> oauth_client -> client_id
GoogleSignin.configure({
  iosClientId: '239698794881-oamlmashqj46ephvn7elbvb7lfja9vr2.apps.googleusercontent.com',
  webClientId: '239698794881-mc60nuu984mpqqtne2eedf3v756he0oa.apps.googleusercontent.com', // Replace with your actual web client ID
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
});

export interface GoogleSignInResult {
  idToken: string | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    photo: string | null;
  };
  serverAuthCode: string | null;
}

/**
 * Sign in with Google
 * @returns Promise with user data and tokens
 */
export const signInWithGoogle = async (): Promise<GoogleSignInResult> => {
  try {
    // Check if Google Play Services are available (Android only)
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Get user info from Google
    const signInResponse = await GoogleSignin.signIn();

    // Check if response is null or undefined
    if (!signInResponse) {
      throw new Error('Google Sign-In returned null or undefined');
    }

    // Log the response to debug
    console.log('Google Sign-In Response:', JSON.stringify(signInResponse, null, 2));

    // Type assertion for the response structure
    const response = signInResponse as any;

    // Handle different response structures
    let user;
    let serverAuthCode = null;

    // Check if user is directly in response (v16 structure)
    if (response.user) {
      user = response.user;
      serverAuthCode = response.serverAuthCode || null;
    } 
    // Check if response itself is the user object
    else if (response.id || response.email) {
      user = response;
    }
    // Check if it's wrapped in data property
    else if (response.data && response.data.user) {
      user = response.data.user;
      serverAuthCode = response.data.serverAuthCode || null;
    }
    else {
      console.error('Unexpected response structure:', response);
      throw new Error('No user data returned from Google Sign-In');
    }

    if (!user) {
      throw new Error('No user data returned from Google Sign-In');
    }

    // Get tokens
    const tokens = await GoogleSignin.getTokens();
    const { idToken } = tokens;

    return {
      idToken: idToken || null,
      user: {
        id: user.id || '',
        name: user.name || null,
        email: user.email || null,
        photo: user.photo || null,
      },
      serverAuthCode: serverAuthCode,
    };
  } catch (error: any) {
    console.error('Google Sign-In Error Details:', error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new Error('User cancelled the login flow');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      throw new Error('Sign in is in progress already');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Play Services not available or outdated');
    } else {
      throw new Error(error.message || 'Something went wrong with Google Sign-In');
    }
  }
};

/**
 * Sign out from Google
 */
export const signOutFromGoogle = async (): Promise<void> => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error('Google Sign-Out Error:', error);
    throw error;
  }
};

/**
 * Check if user is already signed in
 */
export const isSignedIn = async (): Promise<boolean> => {
  try {
    const userInfo = await GoogleSignin.getCurrentUser();
    return !!userInfo;
  } catch (error) {
    console.error('Error checking Google Sign-In status:', error);
    return false;
  }
};

/**
 * Get current user info if already signed in
 */
export const getCurrentUser = async (): Promise<GoogleSignInResult['user'] | null> => {
  try {
    const userInfo = await GoogleSignin.getCurrentUser();
    if (userInfo) {
      // Type assertion for the response structure
      const response = userInfo as any;
      if (response.user) {
        const { user } = response;
        return {
          id: user.id,
          name: user.name || null,
          email: user.email || null,
          photo: user.photo || null,
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting current Google user:', error);
    return null;
  }
};

