import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TrackScreen from '../screens/Track/TrackScreen';
import RideDetailScreen, { TrackStackParamList } from '../screens/Track/RideDetailScreen';
import BookingRequestDetailScreen from '../screens/Search/BookingRequestDetailScreen';
import UserProfileScreen from '../screens/Profile/UserProfileScreen';
import { AvailableRideData } from '../components/search/AvailableRideCard';

// Extend TrackStackParamList to include BookingRequestDetail and UserProfile
export type ExtendedTrackStackParamList = TrackStackParamList & {
  BookingRequestDetail: {
    requestId?: string;
    bookingRequest?: any;
    ride?: any;
  };
  UserProfile: {
    traveler: AvailableRideData['traveler'];
    profileId?: string;
  };
};

const Stack = createStackNavigator<ExtendedTrackStackParamList>();

const TrackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F9FAFF' },
      }}
    >
      <Stack.Screen name="TrackList" component={TrackScreen} />
      <Stack.Screen name="RideDetail" component={RideDetailScreen} />
      <Stack.Screen name="BookingRequestDetail" component={BookingRequestDetailScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
};

export default TrackNavigator;
export type { TrackStackParamList, ExtendedTrackStackParamList };

