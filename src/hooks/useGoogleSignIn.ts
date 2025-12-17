import { useState, useCallback } from 'react';
import { signInWithGoogle, signOutFromGoogle, GoogleSignInResult } from '../services/googleSignIn';
import { useToast } from '../components/Toast';

export const useGoogleSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useToast();

  const signIn = useCallback(async (): Promise<GoogleSignInResult | null> => {
    try {
      setIsLoading(true);
      const result = await signInWithGoogle();
      return result;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      showError(error.message || 'Failed to sign in with Google');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await signOutFromGoogle();
      showSuccess('Signed out from Google successfully');
    } catch (error: any) {
      console.error('Google Sign-Out Error:', error);
      showError(error.message || 'Failed to sign out from Google');
    } finally {
      setIsLoading(false);
    }
  }, [showError, showSuccess]);

  return {
    signIn,
    signOut,
    isLoading,
  };
};

