import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Search, PlusCircle, ShoppingCart, MessageCircle, User, MessageSquare } from 'lucide-react-native';
import { useUnreadChatCount } from '../hooks/useChat';

// Import screens
import SearchNavigator from './SearchNavigator';
import CreateScreen from '../screens/Create/CreateScreen';
import TrackNavigator from './TrackNavigator';
import ChatNavigator from './ChatNavigator';
import ProfileNavigator from './ProfileNavigator';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';

import { SearchStackParamList } from './SearchNavigator';
import { ChatStackParamList } from './ChatNavigator';
import { ProfileStackParamList } from './ProfileNavigator';
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
  Chat: NavigatorScreenParams<ChatStackParamList> | undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Custom tab bar icon component
const TabBarIcon: React.FC<{ focused: boolean; iconName: string; unreadCount?: number }> = ({ focused, iconName, unreadCount }) => {
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

  return (
    <View style={styles.tabIcon}>
      {renderIcon()}
      {iconName === 'Chat' && unreadCount !== undefined && unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const BottomTabNavigator: React.FC = () => {
  // Fetch unread chat count
  const { data: unreadCountData } = useUnreadChatCount();
  const unreadCount = unreadCountData?.total_unread || 0;

  // Main screen names where tabs should be visible
  const mainScreens: { [key: string]: string } = {
    Search: 'SearchList',
    Track: 'TrackList',
    Chat: 'ChatList',
    Profile: 'ProfileList',
  };

  const getTabBarVisibility = (state: any) => {
    if (!state) return true;
    
    const route = state.routes[state.index];
    if (!route) return true;
    
    // For Create screen, always show tabs
    if (route.name === 'Create') {
      return true;
    }
    
    // For navigators, check if we're on the main screen
    const focusedRouteName = getFocusedRouteNameFromRoute(route);
    const mainScreenName = mainScreens[route.name];
    
    // If we can't get the focused route name, assume we're on the main screen (initial route)
    // If we can get it, check if it matches the main screen name
    if (mainScreenName) {
      return focusedRouteName === undefined || focusedRouteName === mainScreenName;
    }
    
    return true;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => {
        const state = navigation.getState();
        const shouldShowTabs = getTabBarVisibility(state);
        
        return {
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              iconName={route.name} 
              unreadCount={route.name === 'Chat' ? unreadCount : undefined}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
              {route.name}
            </Text>
          ),
          tabBarStyle: shouldShowTabs ? styles.tabBar : { display: 'none' },
          tabBarItemStyle: styles.tabBarItem,
          tabBarActiveTintColor: Colors.primaryCyan,
          tabBarInactiveTintColor: Colors.textLight,
          headerShown: false,
        };
      }}
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
        component={ChatNavigator}
        options={{
          title: 'Chat',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
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
    height: Platform.OS === 'ios' ? 65 : 60,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: Platform.OS === 'ios' ? 5 : 0,
    borderRadius: 30,
    marginHorizontal: 8,
    marginBottom: Platform.OS === 'ios' ? 20 : 20,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.2,
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
  badge: {
    position: 'absolute',
    top: -8,
    right: -22,
    backgroundColor: Colors.error || '#FF3B30',
    borderRadius: 100,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.backgroundWhite,
  },
  badgeText: {
    color: Colors.textWhite,
    fontSize: 10,
    fontWeight: Fonts.weightSemiBold,
  },
});

export default BottomTabNavigator;
