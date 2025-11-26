import React, { useEffect, useState } from 'react';
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
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { SvgXml } from 'react-native-svg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Camera, CheckCircle, Calendar, Check } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import GradientButton from '../../components/GradientButton';
import { Header } from '../../components';
import * as ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useProfileSetup } from '../../hooks/useAuthMutations';
import { useAuthStore } from '../../services/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from '../../components/Toast';
import { CameraIcon, MapPinIcon } from '../../assets/icons/svg/main';
import { getCurrentLocation, LocationCoordinates, PermissionResult } from '../../services/geolocation';
import { ActivityIndicator } from 'react-native';
import PermissionModal from '../../components/Modal/PermissionModal';
import { getCountryByCoordinates } from '../../services/api/auth';

const { width } = Dimensions.get('window');


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
  const navigation = useNavigation<any>();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageAsset, setProfileImageAsset] = useState<ImagePicker.Asset | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bio, setBio] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [location, setLocation] = useState<LocationCoordinates | null>(null);
  const [country, setCountry] = useState<string>('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isFetchingCountry, setIsFetchingCountry] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionModalData, setPermissionModalData] = useState<{
    title: string;
    message: string;
    showOpenSettings: boolean;
  } | null>(null);
  const {setUser} = useAuthStore();

  const formattedCountry = country.slice(0, 2).toUpperCase();

  
  const profileSetupMutation = useProfileSetup();
  const { showWarning, showError } = useToast();

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
        setProfileImageAsset(response.assets[0]);
      }
    });
  };

  const handleSaveProfile = () => {
    if (!fullName.trim()) {
      showWarning('Please enter your full name');
      return;
    }

    if (!email.trim()) {
      showWarning('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      showWarning('Please enter a valid email address');
      return;
    }

    if (!dateOfBirth) {
      showWarning('Please enter your date of birth');
      return;
    }

    if (!location || !country) {
      showWarning('Please fetch your location');
      return;
    }

    if (!agreeToTerms) {
      showWarning('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

   

    // Split full name into first and last name
    const nameParts = fullName.trim()?.split(' ');
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || '';

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    // Format date as YYYY-MM-DD
    const formatDateForAPI = (date: Date | null): string => {
      if (!date) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    formData.append('date_of_birth', formatDateForAPI(dateOfBirth));
    formData.append('email', email.trim());
    formData.append('profile.bio', bio.trim() || '');
    

    // Append country
    if (country) {
      formData.append('profile.country', formattedCountry);
    }

    // Append profile photo if available
    if (profileImageAsset && profileImageAsset.uri) {
      const fileExtension = profileImageAsset.uri?.split('.').pop() || 'jpg';
      const fileName = profileImageAsset.fileName || `profile_photo.${fileExtension}`;
      
      formData.append('profile.profile_photo', {
        uri: profileImageAsset.uri,
        type: profileImageAsset.type || `image/${fileExtension}`,
        name: fileName,
      } as any);
    }

    console.log('Saving profile with FormData', formData);

    profileSetupMutation.mutate(formData, {
      onSuccess: (response: any) => {
        setUser(response.user);
        console.log('response', response);
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        });
      },
      onError: (error: any) => {
        console.log('Error saving profile:', error.response);
        const errorMessage = error?.response?.data?.error || 
                            error?.response?.data?.message || 
                            error?.message || 
                            'Failed to save profile. Please try again.';
        showError(errorMessage);
      },
    });
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
      // Don't close on iOS - let user click Done
    }
  };

  const handleTermsPress = () => {
    Alert.alert('Terms of Service', 'Read our terms of service here');
  };

  const handlePrivacyPress = () => {
    Alert.alert('Privacy Policy', 'Read our privacy policy here');
  };

  const handleLocationFetch = async () => {
    setIsFetchingLocation(true);
    try {
      const result = await getCurrentLocation();
      
      // Check if result is LocationCoordinates (has latitude property)
      if ('latitude' in result && 'longitude' in result) {
        const locationData = result as LocationCoordinates;
        setLocation(locationData);
        
        // Fetch country using coordinates
        setIsFetchingCountry(true);
        try {
          const countryResponse = await getCountryByCoordinates(
            locationData.latitude.toString(),
            locationData.longitude.toString()
          );
          if (countryResponse?.country) {
            setCountry(countryResponse.country);
          }
        } catch (countryError: any) {
          console.error('Error fetching country:', countryError);
          showError('Failed to fetch country information');
        } finally {
          setIsFetchingCountry(false);
        }
      } else {
        // It's a PermissionResult
        const permissionResult = result as PermissionResult;
        setPermissionModalData({
          title: 'Location Permission Required',
          message: permissionResult.error || 'Location permission is required.',
          showOpenSettings: permissionResult.shouldOpenSettings,
        });
        setShowPermissionModal(true);
      }
    } catch (error: any) {
      console.error('Error fetching location:', error);
      setPermissionModalData({
        title: 'Error',
        message: error?.error || 'Failed to get location. Please try again.',
        showOpenSettings: false,
      });
      setShowPermissionModal(true);
    } finally {
      setIsFetchingLocation(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />
      {/* Header */}
      <Header title="Profile Setup" />
      
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
      >
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
              {/* <Camera size={20} color={Colors.primaryCyan} /> */}
              <SvgXml xml={CameraIcon} width={20} height={20} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleImagePicker}>
            <Text style={styles.uploadText}>Upload Profile Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information Section */}
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: Colors.textPrimary }]}>Personal Information</Text>

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
            {Platform.OS === 'ios' ? (
              <Modal
                visible={showDatePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowDatePicker(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(false)}
                        style={styles.modalCancelButton}
                      >
                        <Text style={styles.modalCancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <Text style={styles.modalTitle}>Select Date of Birth</Text>
                      <TouchableOpacity
                        onPress={() => {
                          if (dateOfBirth) {
                            setShowDatePicker(false);
                          }
                        }}
                        style={styles.modalDoneButton}
                      >
                        <Text style={[styles.modalDoneText, !dateOfBirth && styles.modalDoneTextDisabled]}>
                          Done
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.datePickerContainer}>
                      <DateTimePicker
                        value={dateOfBirth || new Date()}
                        mode="date"
                        display="spinner"
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                        minimumDate={new Date(1900, 0, 1)}
                        textColor={Colors.textPrimary}
                        style={styles.datePicker}
                      />
                    </View>
                  </View>
                </View>
              </Modal>
            ) : (
              showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                />
              )
            )}
          </View>

          {/* Bio Section */}
          <View style={styles.inputContainer}>
            <Text style={[styles.sectionTitle, { fontWeight: Fonts.weightMedium, marginBottom: 8, fontSize: Fonts.base }]}>Add a Bio</Text>
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

          {/* Location Section */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Location<Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.locationInputWrapper}
              onPress={handleLocationFetch}
              activeOpacity={0.7}
              disabled={isFetchingLocation || isFetchingCountry}
            >
              <SvgXml xml={MapPinIcon} width={20} height={20} />
              {isFetchingLocation || isFetchingCountry ? (
                <View style={styles.locationLoadingContainer}>
                  <ActivityIndicator size="small" color={Colors.primaryCyan} />
                  <Text style={[styles.locationInputText, styles.locationInputPlaceholder]}>
                    {isFetchingLocation ? 'Fetching location...' : 'Fetching country...'}
                  </Text>
                </View>
              ) : country ? (
                <Text style={styles.locationInputText}>
                  {formattedCountry}
                </Text>
              ) : (
                <Text style={[styles.locationInputText, styles.locationInputPlaceholder]}>
                  Tap to fetch your location
                </Text>
              )}
              {country && !isFetchingLocation && !isFetchingCountry && (
                <View style={styles.verifiedIconContainer}>
                  <CheckCircle size={20} color={Colors.primaryCyan} />
                </View>
              )}
            </TouchableOpacity>
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
            title={profileSetupMutation.isPending ? 'Saving...' : 'Save Profile'}
            onPress={handleSaveProfile}
            loading={profileSetupMutation.isPending}
            disabled={!location || !country || isFetchingLocation || isFetchingCountry}
            style={styles.saveButton}
          />
        </View>
      </KeyboardAwareScrollView>

      {/* Permission Modal */}
      {permissionModalData && (
        <PermissionModal
          visible={showPermissionModal}
          title={permissionModalData.title}
          message={permissionModalData.message}
          showOpenSettings={permissionModalData.showOpenSettings}
          onCancel={() => {
            setShowPermissionModal(false);
            setPermissionModalData(null);
          }}
          onOpenSettings={() => {
            setShowPermissionModal(false);
            setPermissionModalData(null);
          }}
        />
      )}
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
    flexGrow: 1,
    paddingBottom: 40,
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
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
    // borderWidth: 2,
    // borderColor: Colors.borderLight,
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
    backgroundColor: Colors.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 3,
    // borderColor: Colors.backgroundWhite,
  },
  uploadText: {
    fontSize: Fonts.base,
    color: Colors.primaryCyan,
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
    color: Colors.primaryCyan,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightMedium,
    color: Colors.primaryCyan,
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
    // backgroundColor: Colors.primaryCyan + '20',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.backgroundWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  modalCancelText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    fontWeight: Fonts.weightMedium,
  },
  modalTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  modalDoneButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  modalDoneText: {
    fontSize: Fonts.base,
    color: Colors.primaryCyan,
    fontWeight: Fonts.weightSemiBold,
  },
  modalDoneTextDisabled: {
    color: Colors.textLight,
    opacity: 0.5,
  },
  datePickerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
  },
  datePicker: {
    width: '100%',
    height: 200,
  },
  locationInputWrapper: {
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
  locationLoadingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    gap: 8,
  },
  locationInputText: {
    flex: 1,
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  locationInputPlaceholder: {
    color: Colors.textLight,
  },
});

export default ProfileSetupScreen;

