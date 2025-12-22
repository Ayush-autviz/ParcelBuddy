import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, CommonActions, useFocusEffect } from '@react-navigation/native';
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
  Trash2,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, GradientButton } from '../../components';
import { useAuthStore } from '../../services/store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile, deleteAccount } from '../../services/api/profile';
import { useToast } from '../../components/Toast';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';

import { ProfileStackParamList } from '../../navigation/ProfileNavigator';
import { SvgXml } from 'react-native-svg';
import { ProfileKycIcon, ProfileRatingsIcon, ProfileSubscriptionIcon, ProfileUserIcon, ProfilePaymentHistoryIcon, ProfileTermsIcon, ProfileSupportIcon } from '../../assets/icons/svg/profileIcon';
import { fetchAndUpdateProfile } from '../../utils/profileUtils';

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
  const { showSuccess, showError } = useToast();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  console.log('user', user);
  const queryClient = useQueryClient();

  // Fetch and update profile when screen comes into focus to get latest KYC status
  useFocusEffect(
    useCallback(() => {
      fetchAndUpdateProfile();
    }, [])
  );

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    queryClient.clear();
    await logout();
    // showSuccess('Logged out successfully');
    // Navigate to root Auth screen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' as never }],
      })
    );
  };

  const handleDeleteAccount = () => {
    setShowDeleteAccountModal(true);
  };

  const confirmDeleteAccount = async () => {
    setShowDeleteAccountModal(false);
    setIsDeletingAccount(true);
    try {
      await deleteAccount();
      queryClient.clear();
      await logout();
      showSuccess('Account deleted successfully');
      // Navigate to root Auth screen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth' as never }],
        })
      );
    } catch (error: any) {
      console.error('Error deleting account:', error);
      showError(error?.response?.data?.error || 'Failed to delete account. Please try again.');
    } finally {
      setIsDeletingAccount(false);
    }
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
      subtitle: user?.kyc_status === 'Approved' ? 'Verified' : user?.kyc_status === 'In Review' ? 'In Review' : user?.kyc_status === 'Rejected' ? 'Rejected' : 'Not Verified',
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
      // subtitle: 'Silver',
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

        {/* Delete Account Button */}
        <TouchableOpacity
          style={[
            styles.deleteAccountButton,
            isDeletingAccount && styles.deleteAccountButtonDisabled,
          ]}
          onPress={handleDeleteAccount}
          disabled={isDeletingAccount}
          activeOpacity={0.7}
        >
          {isDeletingAccount ? (
            <ActivityIndicator size="small" color={Colors.error} />
          ) : (
            <>
              <Trash2 size={20} color={Colors.error} style={styles.deleteAccountIcon} />
              <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Logout Button */}
        <GradientButton
          title="Logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon={<LogOut size={20} color={Colors.textWhite} style={styles.logoutIcon} />}
        />
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />

      {/* Delete Account Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteAccountModal}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
        confirmText="Delete Account"
        cancelText="Cancel"
        onConfirm={confirmDeleteAccount}
        onCancel={() => setShowDeleteAccountModal(false)}
        type="destructive"
      />
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
  deleteAccountButton: {
    marginTop: 8,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.error,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteAccountButtonDisabled: {
    opacity: 0.6,
  },
  deleteAccountButtonText: {
    color: Colors.error,
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    marginLeft: 8,
  },
  deleteAccountIcon: {
    marginRight: 0,
  },
  logoutButton: {
    marginTop: 12,
  },
  logoutIcon: {
    marginRight: 0,
  },
});

export default ProfileScreen;
