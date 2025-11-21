import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import {
  User,
  Shield,
  Check,
  Star,
  Crown,
  Clock,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, GradientButton } from '../../components';
import { useAuthStore } from '../../services/store';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../../services/api/profile';
import { useToast } from '../../components/Toast';

import { ProfileStackParamList } from '../../navigation/ProfileNavigator';
import { SvgXml } from 'react-native-svg';
import { ProfileKycIcon, ProfileRatingsIcon, ProfileSubscriptionIcon, ProfileUserIcon, ProfilePaymentHistoryIcon, ProfileTermsIcon, ProfileSupportIcon } from '../../assets/icons/svg/profileIcon';

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'ProfileList'>;

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  onPress: () => void;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { logout, user } = useAuthStore();
  const { showSuccess } = useToast(); 
  console.log('user', user);


  const handleLogout = async () => {
    await logout();
    showSuccess('Logged out successfully');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  const menuItems: MenuItem[] = [
    {
      id: 'edit',
      title: 'Edit Profile',
      icon: ProfileUserIcon,
      onPress: () => {
        navigation.navigate('EditProfile');
      },
    },
    {
      id: 'kyc',
      title: 'KYC Status',
      subtitle: 'Verified',
      icon: ProfileKycIcon,
      onPress: () => {
        navigation.navigate('KYCVerification');
      },
    },
    {
      id: 'ratings',
      title: 'Ratings',
      icon: ProfileRatingsIcon,
      onPress: () => {
        navigation.navigate('Ratings');
      },
    },
    {
      id: 'subscription',
      title: 'Current Subscription',
      subtitle: 'Silver',
      icon: ProfileSubscriptionIcon,
      onPress: () => {
        navigation.navigate('Subscription');
      },
    },
    {
      id: 'payment',
      title: 'Payment History',
      icon: ProfilePaymentHistoryIcon,
      onPress: () => {
        navigation.navigate('PaymentHistory');
      },
    },
    {
      id: 'terms',
      title: 'Terms & Privacy Policy',
      icon: ProfileTermsIcon,
      onPress: () => {
        navigation.navigate('TermsAndPolicy');
      },
    },
    {
      id: 'support',
      title: 'Support',
      icon: ProfileSupportIcon,
      onPress: () => {
        navigation.navigate('Support');
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" variant="centered" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {user?.profile?.profile_photo ? (
              <Image source={{ uri: user?.profile?.profile_photo }} style={styles.avatarImage} />
            ) : (
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarGradient}
              >
                <User size={60} color={Colors.textWhite} />
              </LinearGradient>
            )}
          </View>
          <Text style={styles.userName}>{user?.first_name} {user?.last_name}</Text>
          <Text style={styles.userAge}>{user?.date_of_birth ? new Date().getFullYear() - new Date(user?.date_of_birth).getFullYear(): ''} years old</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.iconContainer}>   
                     <SvgXml xml={Icon} width={20} height={20} />
                  </View>
                  <View style={styles.menuItemText}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    {item.subtitle && (
                      <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    )}
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.textTertiary} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout Button */}
        <GradientButton
          title="Logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon={<LogOut size={20} color={Colors.textWhite} style={styles.logoutIcon} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.backgroundGray,
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  userName: {
    fontSize: Fonts.xxl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userAge: {
    fontSize: Fonts.base,
    color: Colors.textTertiary,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryCyan + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  shieldContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.textWhite,
  },
  supportContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightMedium,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
  },
  logoutButton: {
    marginTop: 8,
  },
  logoutIcon: {
    marginRight: 0,
  },
});

export default ProfileScreen;
