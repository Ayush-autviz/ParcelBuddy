import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Search, PlusCircle, ShoppingCart, MessageCircle, User, MessageSquare } from 'lucide-react-native';

// Import screens
import SearchNavigator from './SearchNavigator';
import CreateScreen from '../screens/Create/CreateScreen';
import TrackNavigator from './TrackNavigator';
import ChatScreen from '../screens/Chat/ChatScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';

import { SearchStackParamList } from './SearchNavigator';
import { FocusedChatIcon, FocusedCreateIcon, FocusedProfileIcon, FocusedSearchIcon, FocusedTrackIcon, SearchIcon } from '../assets/icons/svg/bottomTabs';
import { SvgXml } from 'react-native-svg';
import { CreateIcon } from '../assets/icons/svg/bottomTabs';
import { TrackIcon } from '../assets/icons/svg/bottomTabs';
import { ChatIcon } from '../assets/icons/svg/bottomTabs';
import { ProfileIcon } from '../assets/icons/svg/bottomTabs';

// Define the bottom tab param list
export type BottomTabParamList = {
  Search: NavigatorScreenParams<SearchStackParamList> | undefined;
  Create: undefined;
  Track: undefined;
  Chat: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Custom tab bar icon component
const TabBarIcon: React.FC<{ focused: boolean; iconName: string }> = ({ focused, iconName }) => {
  const iconColor = focused ? Colors.primaryCyan : Colors.textLight;
  const iconSize = 18;

  const renderIcon = () => {
    switch (iconName) {
      case 'Search':
        // return <Search size={iconSize} color={iconColor} />;
        return <SvgXml xml={focused ? FocusedSearchIcon : SearchIcon} height={iconSize} width={iconSize}  />;
      case 'Create':
        // return <PlusCircle size={iconSize} color={iconColor} />;
        return <SvgXml xml={focused ? FocusedCreateIcon : CreateIcon} height={iconSize} width={iconSize}  />;
      case 'Track':
        // return <ShoppingCart size={iconSize} color={iconColor} />;
        return <SvgXml xml={focused ? FocusedTrackIcon : TrackIcon} height={iconSize} width={iconSize}  />;
      case 'Chat':
        // return <MessageSquare size={iconSize} color={iconColor} />;
        return <SvgXml xml={focused ? FocusedChatIcon : ChatIcon} height={iconSize} width={iconSize}  />;
      case 'Profile':
        // return <User size={iconSize} color={iconColor} />;
        return <SvgXml xml={focused ? FocusedProfileIcon : ProfileIcon} height={iconSize} width={iconSize}  />;
      default:
        return null;
    }
  };

  return <View style={styles.tabIcon}>{renderIcon()}</View>;
};

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabBarIcon focused={focused} iconName={route.name} />
        ),
        tabBarLabel: ({ focused }) => (
          <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
            {route.name}
          </Text>
        ),
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarActiveTintColor: Colors.primaryCyan,
        tabBarInactiveTintColor: Colors.textLight,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Search"
        component={SearchNavigator}
        options={{
          title: 'Search',
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          title: 'Create',
        }}
      />
      <Tab.Screen
        name="Track"
        component={TrackNavigator}
        options={{
          title: 'Track',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Chat',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.backgroundWhite,
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 65 : 70,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: Platform.OS === 'ios' ? 5 : 10,
    borderRadius: 30,
    marginHorizontal: 8,
    marginBottom: Platform.OS === 'ios' ? 20 : 20,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabBarItem: {
    // paddingVertical: 5,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: 4,
  },
  tabLabel: {
    fontSize: Fonts.sm,
    color: Colors.textLight,
    fontWeight: Fonts.weightMedium,
  },
  tabLabelFocused: {
    color: Colors.primaryCyan,
    fontWeight: Fonts.weightSemiBold,
  },
});

export default BottomTabNavigator;
