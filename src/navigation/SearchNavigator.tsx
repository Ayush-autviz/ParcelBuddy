import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from '../screens/Search/SearchScreen';
import PlacesSearchScreen from '../screens/Search/PlacesSearchScreen';
import { PlaceResultItemData } from '../components';

import AvailableRidesScreen from '../screens/Search/AvailableRidesScreen';
import SendRequestScreen from '../screens/Search/SendRequestScreen';
import BookingStatusScreen from '../screens/Search/BookingStatusScreen';
import UserProfileScreen from '../screens/Profile/UserProfileScreen';
import { AvailableRideData } from '../components/search/AvailableRideCard';

export type SearchStackParamList = {
  SearchList: {
    selectedPlace?: PlaceResultItemData;
    fieldType?: 'from' | 'to';
  };
  PlacesSearch: {
    fieldType: 'from' | 'to' | 'origin' | 'destination';
    isDomestic: boolean;
    initialValue?: string;
    storeType?: 'search' | 'create'; // Which store to use
  };
  AvailableRides: {
    rides: AvailableRideData[];
    from: string;
    to: string;
    date: string;
  };
  SendRequest: {
    ride: AvailableRideData;
  };
  BookingStatus: {
    bookingRequest: any; // The booking request response from API
  };
  UserProfile: {
    traveler: AvailableRideData['traveler'];
  };
};

const Stack = createStackNavigator<SearchStackParamList>();

const SearchNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F9FAFF' },
      }}
    >
      <Stack.Screen name="SearchList" component={SearchScreen} />
      <Stack.Screen name="PlacesSearch" component={PlacesSearchScreen} />
      <Stack.Screen name="AvailableRides" component={AvailableRidesScreen} />
      <Stack.Screen name="SendRequest" component={SendRequestScreen} />
      <Stack.Screen name="BookingStatus" component={BookingStatusScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
};

export default SearchNavigator;
export type { SearchStackParamList };

