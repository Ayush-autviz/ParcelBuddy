import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import KYCVerificationScreen from '../screens/Profile/KYCVerificationScreen';
import KYCWebViewScreen from '../screens/Profile/KYCWebViewScreen';
import SupportScreen from '../screens/Profile/SupportScreen';
import TermsAndPolicyScreen from '../screens/Profile/TermsAndPolicyScreen';
import PaymentHistoryScreen from '../screens/Profile/PaymentHistoryScreen';
import SubscriptionScreen from '../screens/Profile/SubscriptionScreen';
import RatingsScreen from '../screens/Profile/RatingsScreen';

export type ProfileStackParamList = {
  ProfileList: undefined;
  EditProfile: undefined;
  KYCVerification: undefined;
  KYCWebView: {
    url: string;
  };
  Support: undefined;
  TermsAndPolicy: undefined;
  PaymentHistory: undefined;
  Subscription: undefined;
  Ratings: undefined;
};

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F9FAFF' },
      }}
    >
      <Stack.Screen name="ProfileList" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="KYCVerification" component={KYCVerificationScreen} />
      <Stack.Screen name="KYCWebView" component={KYCWebViewScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="TermsAndPolicy" component={TermsAndPolicyScreen} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="Ratings" component={RatingsScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
export type { ProfileStackParamList };

