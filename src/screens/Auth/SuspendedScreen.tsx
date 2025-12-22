import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AlertCircle, Copy } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useContactSupport } from '../../hooks/useProfile';
import { useToast } from '../../components/Toast';
import { Clipboard } from 'react-native';

const { width, height } = Dimensions.get('window');

type SuspendedScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Suspended'>;

const SuspendedScreen: React.FC = () => {
  const navigation = useNavigation<SuspendedScreenNavigationProp>();
  const { data: contactSupportData, isLoading } = useContactSupport();
  const { showSuccess } = useToast();

  const supportEmail = contactSupportData?.email || 'support@parcelbuddy.com';

  const handleCopyEmail = () => {
    Clipboard.setString(supportEmail);
    showSuccess('Email copied to clipboard');
  };

  const handleLogout = () => {
    // Navigate back to login
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Bottom Sheet Card */}
        <View style={styles.card}>
          {/* Bottom Sheet Handle */}
          {/* <View style={styles.handle} /> */}
          
          {/* Suspension Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <AlertCircle size={64} color={Colors.error} strokeWidth={2} />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Account Suspended</Text>

          {/* Description */}
          <Text style={styles.description}>
            Your account has been temporarily suspended. This may be due to a violation of our terms of service or community guidelines.
          </Text>



          {/* Contact Support Section */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Need Help?</Text>
            <Text style={styles.contactDescription}>
              If you believe this is an error or have questions about your suspension, please contact our support team.
            </Text>

            {/* Contact Card */}
            <TouchableOpacity
              style={styles.contactCard}
              onPress={handleCopyEmail}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <View style={styles.contactContent}>
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactLabel}>Contact Us:</Text>
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color={Colors.primaryCyan} />
                      <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                  ) : (
                    <Text style={styles.contactEmail}>{supportEmail}</Text>
                  )}
                </View>
                {!isLoading && (
                  <View style={styles.copyIconContainer}>
                    <Copy size={20} color={Colors.textPrimary} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
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
  scrollContainer: {
    // flexGrow: 1,
    // justifyContent: 'flex-end',
  },
  card: {
    // backgroundColor: Colors.backgroundWhite,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
    marginTop: 'auto',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.textTertiary + '40',
    borderRadius: 2,
    marginTop: -8,
    marginBottom: 20,
  },
  iconContainer: {
    // marginTop: 10,
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: Colors.error + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.error + '30',
  },
  title: {
    fontSize: Fonts.xxl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: Fonts.base,
    color: Colors.textTertiary,
    textAlign: 'center',
    // lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  infoBox: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: 16,
    padding: 12,
    width: '100%',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  contactSection: {
    width: '100%',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  contactDescription: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  contactCard: {
    backgroundColor: '#DFF1F2',
    borderRadius: 12,
    padding: 20,
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  contactEmail: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
  },
  copyIconContainer: {
    marginLeft: 16,
    padding: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: Fonts.base,
    color: Colors.textTertiary,
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightMedium,
    color: Colors.textTertiary,
  },
});

export default SuspendedScreen;

