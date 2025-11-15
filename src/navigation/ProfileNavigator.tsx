import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';

export type ProfileStackParamList = {
  ProfileList: undefined;
  EditProfile: undefined;
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
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
export type { ProfileStackParamList };

