import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '../screens/Chat/ChatScreen';
import ChatDetailScreen from '../screens/Chat/ChatDetailScreen';

export type ChatStackParamList = {
  ChatList: undefined;
  ChatDetail: {
    roomId: string;
    userName: string;
    userAvatar?: string;
    origin?: string;
    destination?: string;
    luggage_request_id?: string;
    luggage_request_status?: string;
    luggage_request_weight?: number;
    is_ride_created_by_me?: boolean;
  };
};

const Stack = createStackNavigator<ChatStackParamList>();

const ChatNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F9FAFF' },
      }}
    >
      <Stack.Screen name="ChatList" component={ChatScreen} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
    </Stack.Navigator>
  );
};

export default ChatNavigator;

