import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TrackScreen from '../screens/Track/TrackScreen';
import RideDetailScreen, { TrackStackParamList } from '../screens/Track/RideDetailScreen';

const Stack = createStackNavigator<TrackStackParamList>();

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
    </Stack.Navigator>
  );
};

export default TrackNavigator;
export type { TrackStackParamList };

