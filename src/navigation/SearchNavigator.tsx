import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from '../screens/Search/SearchScreen';
import PlacesSearchScreen from '../screens/Search/PlacesSearchScreen';
import { PlaceResultItemData } from '../components';

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
    </Stack.Navigator>
  );
};

export default SearchNavigator;
export type { SearchStackParamList };

