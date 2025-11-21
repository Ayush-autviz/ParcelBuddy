import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { User, Pencil, ChevronDown } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import PhoneInput from 'react-native-international-phone-number';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { ProfileHeader, GradientButton, DatePickerInput, TextArea } from '../../components';
import { useAuthStore } from '../../services/store';
import { useToast } from '../../components/Toast';
import { useMyProfile } from '../../hooks/useProfile';
import { useProfileSetup } from '../../hooks/useAuthMutations';
import { useQueryClient } from '@tanstack/react-query';

type ProfileStackParamList = {
  ProfileList: undefined;
  EditProfile: undefined;
};

type EditProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'EditProfile'>;

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const { user, setUser } = useAuthStore();
  const { showSuccess, showError } = useToast();
  const phoneInputRef = useRef<any>(null);
  const queryClient = useQueryClient();

  // Fetch profile data from API
  const { data: profileData, isLoading, isError, error } = useMyProfile();
  
  // Profile update mutation
  const profileSetupMutation = useProfileSetup();
  
  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Log the profile data and update form fields when profile data loads
  React.useEffect(() => {
    if (profileData) {
      console.log('📱 [EDIT PROFILE] Profile data from API:', JSON.stringify(profileData, null, 2));
      
      // Update form fields with API data
      const firstName = profileData.first_name || '';
      const lastName = profileData.last_name || '';
      setFullName(`${firstName} ${lastName}`.trim() || '');
      
      // Handle null date_of_birth
      setDateOfBirth(
        profileData.date_of_birth && profileData.date_of_birth !== null
          ? new Date(profileData.date_of_birth)
          : null
      );
      
      setBio(profileData.profile?.bio || '');
      setEmail(profileData.email || '');
      setProfilePhoto(profileData.profile?.profile_photo || null);
      
      // Parse and set phone number
      const parsed = parsePhoneNumber(profileData.phone);
      setPhoneNumber(parsed.number);
      setSelectedCountry(parsed.country);
    }
    if (isError) {
      console.error('❌ [EDIT PROFILE] Error fetching profile:', error);
    }
    if (isLoading) {
      console.log('⏳ [EDIT PROFILE] Loading profile data...');
    }
  }, [profileData, isError, error, isLoading]);

  // Parse phone number from user data
  const parsePhoneNumber = (phone: string | undefined) => {
    if (!phone) return { number: '', country: 'US' };
    // If phone starts with +, extract country code
    if (phone.startsWith('+1')) {
      return { number: phone.replace(/^\+1/, ''), country: 'US' };
    }
    if (phone.startsWith('+91')) {
      return { number: phone.replace(/^\+91/, ''), country: 'IN' };
    }
    // Try to detect other country codes (simplified - can be enhanced)
    const usMatch = phone.match(/^\+1(.+)/);
    if (usMatch) {
      return { number: usMatch[1], country: 'CA' };
    }
    // Default to US
    return { number: phone.replace(/^\+\d+/, ''), country: 'CA' };
  };

  // Use profile data from API if available, otherwise fallback to user from store
  const currentProfile = profileData || user;
  const parsedPhone = parsePhoneNumber(currentProfile?.phone);

  // Form state - initialize from API data or store
  const [fullName, setFullName] = useState(
    `${currentProfile?.first_name || ''} ${currentProfile?.last_name || ''}`.trim() || ''
  );
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
    currentProfile?.date_of_birth ? new Date(currentProfile.date_of_birth) : null
  );
  const [bio, setBio] = useState(currentProfile?.profile?.bio || '');
  const [phoneNumber, setPhoneNumber] = useState(parsedPhone.number);
  const [selectedCountry, setSelectedCountry] = useState<string>(parsedPhone.country);
  const [countryCode, setCountryCode] = useState('');
  const [email, setEmail] = useState(currentProfile?.email || '');
  const [profilePhoto, setProfilePhoto] = useState(currentProfile?.profile?.profile_photo || null);

  // Validation
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateFullName = (name: string): boolean => {
    if (!name.trim()) {
      setFullNameError('Full name is required');
      return false;
    }
    setFullNameError('');
    return true;
  };

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleImagePicker = () => {
    // TODO: Implement image picker
    Alert.alert('Image Picker', 'Image picker functionality will be implemented');
  };

  const handleSave = () => {
    // Validate required fields
    const isFullNameValid = validateFullName(fullName);
    const isEmailValid = validateEmail(email);

    if (!isFullNameValid || !isEmailValid) {
      showError('Please fix the errors before saving');
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    setShowConfirmModal(false);

    // Get full phone number from PhoneInput
    let fullPhoneNumber: string;
    if (phoneInputRef.current?.getPhoneNumber) {
      fullPhoneNumber = phoneInputRef.current.getPhoneNumber();
    } else {
      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
      const countryCodeClean = countryCode.replace(/^\+/, '');
      fullPhoneNumber = `+${countryCodeClean}${cleanedPhoneNumber}`;
    }

    if (!fullPhoneNumber.startsWith('+')) {
      fullPhoneNumber = `+${fullPhoneNumber}`;
    }

    // Split full name into first and last name
    const nameParts = fullName.trim().split(' ');
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || '';

    // Create FormData for API call
    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('email', email.trim());
    formData.append('phone', fullPhoneNumber);
    
    if (dateOfBirth) {
      formData.append('date_of_birth', dateOfBirth.toISOString().split('T')[0]);
    }
    
    if (bio.trim()) {
      formData.append('profile.bio', bio.trim());
    }

    // Note: Profile photo upload would go here if image picker is implemented
    // if (profileImageAsset && profileImageAsset.uri) {
    //   formData.append('profile.profile_photo', {
    //     uri: profileImageAsset.uri,
    //     type: profileImageAsset.type || 'image/jpeg',
    //     name: profileImageAsset.fileName || 'profile_photo.jpg',
    //   } as any);
    // }

    console.log('📝 [EDIT PROFILE] Saving profile with FormData:', {
      first_name,
      last_name,
      email: email.trim(),
      phone: fullPhoneNumber,
      date_of_birth: dateOfBirth?.toISOString().split('T')[0],
      bio: bio.trim(),
    });

    profileSetupMutation.mutate(formData, {
      onSuccess: (response) => {
        console.log('✅ [EDIT PROFILE] Profile updated successfully:', response);
        showSuccess('Profile updated successfully');

        setUser(response.user);
        // Invalidate and refetch profile data
        queryClient.invalidateQueries({ queryKey: ['myProfile'] });
        // Navigate back after a short delay
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      },
      onError: (error: any) => {
        console.error('❌ [EDIT PROFILE] Error updating profile:', error);
        showError(error?.response?.data?.message || error?.message || 'Failed to update profile. Please try again.');
      },
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader title="Edit Profile" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <View style={styles.avatarContainer}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
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
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={handleImagePicker}
              activeOpacity={0.7}
            >
              <View style={styles.editIcon}>
                <Pencil size={14} color={Colors.textPrimary} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Full Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Full Name<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, fullNameError && styles.inputError]}
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (fullNameError) validateFullName(text);
              }}
              onBlur={() => validateFullName(fullName)}
            />
            {fullNameError ? (
              <Text style={styles.errorText}>{fullNameError}</Text>
            ) : null}
          </View>

          {/* Date of Birth */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Date of Birth<Text style={styles.required}>*</Text>
            </Text>
            <DatePickerInput
              value={dateOfBirth}
              onChange={setDateOfBirth}
              placeholder="mm / dd / yyyy"
              maximumDate={new Date()}
              containerStyle={styles.datePickerContainer}
            />
          </View>

          {/* Bio */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Add a Bio</Text>
            <TextArea
              placeholder="Tell us more about yourself"
              value={bio}
              onChangeText={setBio}
              containerStyle={styles.textAreaContainer}
              inputStyle={styles.textArea}
            />
          </View>

          {/* Mobile Number */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Enter your mobile number</Text>
            <View style={styles.phoneInputWrapper}>
              <PhoneInput
                ref={phoneInputRef}
                defaultValue={phoneNumber}
                disabled={true}
                value={phoneNumber}
                defaultCountry={selectedCountry as any}
                onChangePhoneNumber={(number) => {
                  setPhoneNumber(number);
                }}
                onChangeSelectedCountry={(country: any) => {
                  setCountryCode(country?.idd?.root || '+1');
                }}
                customCaret={() => <ChevronDown size={16} color="#666" />}
                phoneInputStyles={{
                  container: {
                    borderWidth: 0,
                    borderRadius: 12,
                    backgroundColor: "#FFFFFF",
                    height: 50,
                  },
                  flagContainer: {
                    borderWidth: 0,
                    borderRadius: 12,
                    backgroundColor: "#FFFFFF",
                  },
                  divider: {
                    display: 'none',
                  },
                  callingCode: {
                    display: 'none',
                  },
                  input: {
                    paddingLeft: -10,
                  },
                }}
                modalStyles={{
                  searchContainer: {},
                  searchInput: {
                    backgroundColor: 'white',
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                    padding: 14,
                    fontSize: 16,
                    color: '#203049',
                    fontWeight: '500',
                  },
                  countryItem: {
                    padding: 14,
                    borderColor: '#E0E0E0',
                    borderWidth: 1,
                    borderRadius: 14,
                  },
                }}
                placeholder="Enter mobile number"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Email Address<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, emailError && styles.inputError]}
              placeholder="your@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) validateEmail(text);
              }}
              onBlur={() => validateEmail(email)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <GradientButton
            title="Save"
            onPress={handleSave}
            style={styles.saveButton}
            loading={profileSetupMutation.isPending}
            disabled={profileSetupMutation.isPending}
          />
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Changes</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to save these changes to your profile?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowConfirmModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <GradientButton
                title="Confirm"
                onPress={handleConfirmSave}
                style={styles.modalConfirmButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
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
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  editIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.borderLight,
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formSection: {
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
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
    minHeight: 50,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: Fonts.sm,
    color: Colors.error,
    marginTop: 4,
  },
  datePickerContainer: {
    marginTop: 0,
  },
  textAreaContainer: {
    marginTop: 0,
  },
  textArea: {
    minHeight: 100,
  },
  phoneInputWrapper: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    backgroundColor: Colors.backgroundGray,
    overflow: 'hidden',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    backgroundColor: Colors.backgroundWhite,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
  },
  saveButton: {
    flex: 2,
    marginTop: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    backgroundColor: Colors.backgroundWhite,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButtonText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
  },
  modalConfirmButton: {
    flex: 1,
    marginTop: 0,
  },
});

export default EditProfileScreen;

