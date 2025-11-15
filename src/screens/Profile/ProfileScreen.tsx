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

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'ProfileList'>;

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<any>;
  onPress: () => void;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { logout, user } = useAuthStore();
  const { showSuccess } = useToast();

  console.log('user', user);
  

  // const { data: profile } = useQuery({
  //   queryKey: ['profile'],
  //   queryFn: () => getProfile(),
  // });

  // const profileData = profile?.[0] || user;
  // const firstName = profileData?.first_name || profileData?.user?.first_name || 'User';
  // const lastName = profileData?.last_name || profileData?.user?.last_name || '';
  // const fullName = `${firstName} ${lastName}`.trim() || 'User Name';
  // const profilePhoto = profileData?.profile?.profile_photo;
  // const age = profileData?.profile?.age || 28; // Default age if not available

  // log

  const handleLogout = async () => {
    await logout();
    showSuccess('Logged out successfully');
    // Navigation will be handled by RootNavigator based on auth state
  };

  const menuItems: MenuItem[] = [
    {
      id: 'edit',
      title: 'Edit Profile',
      icon: User,
      onPress: () => {
        navigation.navigate('EditProfile');
      },
    },
    {
      id: 'kyc',
      title: 'KYC Status',
      subtitle: 'Verified',
      icon: Shield,
      onPress: () => {
        navigation.navigate('KYCVerification');
      },
    },
    {
      id: 'ratings',
      title: 'Ratings',
      icon: Star,
      onPress: () => {
        navigation.navigate('Ratings');
      },
    },
    {
      id: 'subscription',
      title: 'Current Subscription',
      subtitle: 'Silver',
      icon: Crown,
      onPress: () => {
        navigation.navigate('Subscription');
      },
    },
    {
      id: 'payment',
      title: 'Payment History',
      icon: Clock,
      onPress: () => {
        navigation.navigate('PaymentHistory');
      },
    },
    {
      id: 'terms',
      title: 'Terms & Privacy Policy',
      icon: FileText,
      onPress: () => {
        navigation.navigate('TermsAndPolicy');
      },
    },
    {
      id: 'support',
      title: 'Support',
      icon: HelpCircle,
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
          {/* <Text style={styles.userAge}>{age} years old</Text> */}
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
                    {item.id === 'kyc' ? (
                      <View style={styles.shieldContainer}>
                        <Shield size={20} color={Colors.primaryCyan} />
                        <View style={styles.checkBadge}>
                          <Check size={10} color={Colors.textWhite} />
                        </View>
                      </View>
                    ) : item.id === 'support' ? (
                      <View style={styles.supportContainer}>
                        <HelpCircle size={20} color={Colors.primaryCyan} />
                      </View>
                    ) : (
                      <Icon size={20} color={Colors.primaryCyan} />
                    )}
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
    backgroundColor: Colors.primaryCyan + '20',
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
