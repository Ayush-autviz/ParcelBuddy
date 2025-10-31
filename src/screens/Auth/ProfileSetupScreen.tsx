import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  StatusBar,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { SvgXml } from 'react-native-svg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ArrowLeft, Camera, CheckCircle, Calendar, Check } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import GradientButton from '../../components/GradientButton';
import * as ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

type ProfileSetupNavigationProp = StackNavigationProp<AuthStackParamList, 'ProfileSetup'>;

// User SVG with gradient
const UserIcon = `
<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.0124 25.6438C32.5353 25.6 36.5853 21.5375 36.7249 13.8292C36.5957 6.41253 32.327 2.13337 24.9874 2.08545C17.5687 2.13128 13.2749 6.50628 13.2749 13.9021C13.2749 21.2979 17.5707 25.6 25.0124 25.6438Z" fill="url(#paint0_linear_425_3396)"/>
<path d="M24.9875 28.4604C13.8875 28.5312 7.91459 34.525 7.71459 45.7979C7.70626 46.3562 7.92084 46.8958 8.31251 47.2937C8.70417 47.6916 9.23959 47.9166 9.79792 47.9166H40.2042C40.7625 47.9166 41.2979 47.6916 41.6896 47.2937C42.0813 46.8958 42.2958 46.3562 42.2875 45.7979C42.0958 34.6875 35.9625 28.5312 24.9875 28.4604Z" fill="url(#paint1_linear_425_3396)"/>
<defs>
<linearGradient id="paint0_linear_425_3396" x1="24.9999" y1="2.08545" x2="24.9999" y2="25.6438" gradientUnits="userSpaceOnUse">
<stop stop-color="#3095CB"/>
<stop offset="1" stop-color="#4DBAA5"/>
</linearGradient>
<linearGradient id="paint1_linear_425_3396" x1="25.001" y1="28.4604" x2="25.001" y2="47.9166" gradientUnits="userSpaceOnUse">
<stop stop-color="#3095CB"/>
<stop offset="1" stop-color="#4DBAA5"/>
</linearGradient>
</defs>
</svg>
`;

const ProfileSetupScreen: React.FC = () => {
  const navigation = useNavigation<ProfileSetupNavigationProp>();
  const { login } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bio, setBio] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailVerified(validateEmail(text));
  };

  const handleImagePicker = () => {
    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 500,
      maxHeight: 500,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.assets && response.assets[0]) {
        setProfileImage(response.assets[0].uri || null);
      }
    });
  };

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!dateOfBirth) {
      Alert.alert('Error', 'Please enter your date of birth');
      return;
    }

    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual profile save API call
      console.log('Saving profile:', {
        profileImage,
        fullName,
        email,
        dateOfBirth: dateOfBirth?.toISOString(),
        bio,
      });

      // Simulate API call
      await new Promise<void>((resolve) => setTimeout(resolve, 2000));

      Alert.alert('Success', 'Profile saved successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to main app
            login('user@parcelbuddy.com', 'password');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month} / ${day} / ${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      if (Platform.OS === 'ios') {
        setShowDatePicker(false);
      }
    }
  };

  const handleTermsPress = () => {
    Alert.alert('Terms of Service', 'Read our terms of service here');
  };

  const handlePrivacyPress = () => {
    Alert.alert('Privacy Policy', 'Read our privacy policy here');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile Setup</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Profile Photo Upload Section */}
        <View style={styles.profilePhotoSection}>
          <TouchableOpacity
            style={styles.profilePhotoContainer}
            onPress={handleImagePicker}
            activeOpacity={0.8}
          >
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.profilePhotoPlaceholder}>
                <SvgXml xml={UserIcon} width={60} height={60} />
              </View>
            )}
            <View style={styles.cameraIconContainer}>
              <Camera size={20} color={Colors.textWhite} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleImagePicker}>
            <Text style={styles.uploadText}>Upload Profile Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information Section */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Full Name<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.textLight}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Email Address Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Email Address<Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.emailInputWrapper}>
              <TextInput
                style={[styles.input, styles.emailInput]}
                placeholder="your@email.com"
                placeholderTextColor={Colors.textLight}
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {emailVerified && (
                <View style={styles.verifiedIconContainer}>
                  <CheckCircle size={20} color={Colors.primaryCyan} />
                </View>
              )}
            </View>
          </View>

          {/* Date of Birth Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Date of Birth<Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dateInputWrapper}
              onPress={() => {
                setShowDatePicker(true)}}
              activeOpacity={0.7}
            >
              <Calendar size={20} color={Colors.textLight} style={styles.calendarIcon} />
              <Text
                style={[
                  styles.dateInputText,
                  !dateOfBirth && styles.dateInputPlaceholder,
                ]}
              >
                {dateOfBirth ? formatDate(dateOfBirth) : 'mm / dd / yyyy'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            )}
          </View>

          {/* Bio Section */}
          <View style={styles.inputContainer}>
            <Text style={styles.sectionTitle}>Add a Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Tell us more about yourself"
              placeholderTextColor={Colors.textLight}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Terms and Privacy Checkbox */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, agreeToTerms && styles.checkboxActive]}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              {agreeToTerms && (
                <Check size={14} color={Colors.textWhite} strokeWidth={3} />
              )}
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              By continuing, you agree to our{' '}
              <Text style={styles.linkText} onPress={handleTermsPress}>
                Terms of Service
              </Text>
              {' and '}
              <Text style={styles.linkText} onPress={handlePrivacyPress}>
                Privacy Policy
              </Text>
            </Text>
          </View>

          {/* Save Profile Button */}
          <GradientButton
            title="Save Profile"
            onPress={handleSaveProfile}
            loading={loading}
            style={styles.saveButton}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
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
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.backgroundLight,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: Fonts.xl,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  profilePhotoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: Colors.backgroundLight,
  },
  profilePhotoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.backgroundWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePhotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.backgroundWhite,
  },
  uploadText: {
    fontSize: Fonts.base,
    color: Colors.primaryTeal,
    fontWeight: Fonts.weightSemiBold,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    padding: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  required: {
    color: Colors.error,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    backgroundColor: Colors.backgroundWhite,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: Fonts.base,
    color: Colors.textPrimary,
  },
  emailInputWrapper: {
    position: 'relative',
  },
  emailInput: {
    paddingRight: 50,
  },
  verifiedIconContainer: {
    position: 'absolute',
    right: 16,
    top: 14,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryCyan + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    backgroundColor: Colors.backgroundWhite,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 50,
  },
  calendarIcon: {
    marginRight: 12,
  },
  dateInputText: {
    flex: 1,
    fontSize: Fonts.base,
    color: Colors.textPrimary,
  },
  dateInputPlaceholder: {
    color: Colors.textLight,
  },
  bioInput: {
    minHeight: 100,
    paddingTop: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundWhite,
  },
  checkboxActive: {
    backgroundColor: Colors.primaryTeal,
    borderColor: Colors.primaryTeal,
  },
  checkboxText: {
    flex: 1,
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  linkText: {
    color: Colors.primaryTeal,
    fontWeight: Fonts.weightSemiBold,
  },
  saveButton: {
    marginTop: 10,
  },
});

export default ProfileSetupScreen;

