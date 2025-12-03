import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { User, Star, Check, MessageCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, Card, GradientButton } from '../../components';
import { SearchStackParamList } from '../../navigation/SearchNavigator';
import { AvailableRideData } from '../../components/search/AvailableRideCard';
import { useProfileById } from '../../hooks/useProfile';
import { SvgXml } from 'react-native-svg';
import { ProfileUserIcon } from '../../assets/icons/svg/profileIcon';

type UserProfileScreenRouteProp = RouteProp<SearchStackParamList, 'UserProfile'>;
type UserProfileScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'UserProfile'>;

const UserProfileScreen: React.FC = () => {
  const route = useRoute<UserProfileScreenRouteProp>();
  const navigation = useNavigation<UserProfileScreenNavigationProp>();
  const { traveler, profileId: routeProfileId } = route.params;

  // Use profileId from route params if available, otherwise fallback to traveler.profile.id
  const profileId = routeProfileId || (traveler as any)?.profile?.id;
  const { data: profileDataResponse, isLoading, isError, error } = useProfileById(profileId);

  // Extract the actual profile data from the API response
  // API response structure: { message: "...", profile: { ... } }
  const profileData = profileDataResponse?.profile || profileDataResponse;
  const currentProfile: any = profileData || traveler;

  const firstName = currentProfile?.first_name || '';
  const lastName = currentProfile?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Traveler';
  
  // Profile photo is nested: profileData.profile.profile_photo
  const profilePhoto = currentProfile?.profile?.profile_photo;
  
  // Calculate age from date_of_birth
  const calculateAge = (dateOfBirth: string | null | undefined): number => {
    if (!dateOfBirth) return 28; // Default age
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return 28;
    }
  };
  
  // Date of birth can be at profileData.date_of_birth or profileData.profile.date_of_birth
  const age = calculateAge(currentProfile?.date_of_birth || currentProfile?.profile?.date_of_birth);
  
  // Get data from API response - handle nested structure
  // New API structure: { profile: { profile: { average_rating, bio, ... }, ride_details: { ... }, total_rating, ... } }
  const nestedProfile = currentProfile?.profile;
  const rating = nestedProfile?.average_rating || currentProfile?.average_rating || 0;
  const reviewCount = currentProfile?.total_rating || nestedProfile?.review_count || currentProfile?.review_count || nestedProfile?.total_reviews || 0;
  const about = nestedProfile?.bio || currentProfile?.bio || 'No bio available.';
  const isVerified = nestedProfile?.is_kyc_verified || currentProfile?.is_kyc_verified || nestedProfile?.is_verified || currentProfile?.is_verified || nestedProfile?.verified || false;
  
  // Get ride details from new API structure
  const rideDetails = currentProfile?.ride_details;
  const ridesPublished = rideDetails?.total_ride || nestedProfile?.rides_published || currentProfile?.rides_published || nestedProfile?.total_rides_published || 0;
  const ridesCompleted = rideDetails?.completed_ride || nestedProfile?.rides_completed || currentProfile?.rides_completed || nestedProfile?.total_rides_completed || 0;

  const handleChat = () => {
    // TODO: Navigate to chat screen
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    // const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={20} color="#FFD700" fill="#FFD700" />
        );
      // } else if (i === fullStars && hasHalfStar) {
      //   // For half star, we'll show a filled star with reduced opacity for the empty part
      //   stars.push(
      //     <View key={i} style={styles.halfStarContainer}>
      //       <Star size={20} color="#FFD700" fill="#FFD700" />
      //       <View style={styles.halfStarOverlay} />
      //     </View>
      //   );
      } else {
        stars.push(
          <Star key={i} size={20} color="#E0E0E0" fill="#E0E0E0" />
        );
      }
    }
    return stars;
  };

  // Show loading state
  if (isLoading && profileId) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Profile" showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryCyan} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state (but still show fallback data)
  if (isError && profileId) {
    // Failed to load profile from API, using fallback data
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" showBackButton />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Picture and Name */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                {/* <User size={60} color={Colors.primaryCyan} /> */}
                <SvgXml xml={ProfileUserIcon} width={60} height={60} />
              </View>
            )}
          </View>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userAge}>{age} years old</Text>
        </View>

        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <View style={styles.starsContainer}>
            {renderStars(rating)}
          </View>
          <Text style={styles.ratingText}>
            {rating} ({reviewCount} reviews)
          </Text>
        </View>

        {/* Chat Button */}
        {/* <GradientButton
          title="Chat with Traveller"
          onPress={handleChat}
          style={styles.chatButton}
          icon={<MessageCircle size={20} color={Colors.textWhite} style={styles.chatIcon} />}
        /> */}

        {/* Statistics Card */}
        <Card style={styles.statsCard} padding={10}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Rides published: </Text>
              <Text style={styles.statValue}>{ridesPublished}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Rides completed: </Text>
              <Text style={styles.statValue}>{ridesCompleted}</Text>
            </View>
          </View>
        </Card>

        {/* About Section */}
        <Card style={styles.aboutCard} padding={20}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{about}</Text>
        </Card>

        {/* Verification Section - Only show if verified */}
        {isVerified && (
          <Card style={styles.verificationCard} padding={20}>
            <Text style={styles.sectionTitle}>Verification</Text>
            <View style={styles.verificationRow}>
              <View style={styles.checkIconContainer}>
                <Check size={14} color={Colors.backgroundWhite} strokeWidth={3} />
              </View>
              <Text style={styles.verificationText}>ID Verified</Text>
            </View>
          </Card>
        )}
     
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
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
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.backgroundWhite,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.textLight,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  userName: {
    fontSize: Fonts.xxl,
    fontWeight: Fonts.weightMedium,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userAge: {
    fontSize: Fonts.base,
    color: Colors.textTertiary,
  },
  ratingSection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 8,
    gap: 4,
  },
  halfStarContainer: {
    position: 'relative',
    width: 20,
    height: 20,
  },
  halfStarOverlay: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50%',
    height: '100%',
    backgroundColor: Colors.backgroundLight,
  },
  ratingText: {
    fontSize: Fonts.base,
    color: Colors.textTertiary ,
    fontWeight: Fonts.weightMedium,
  },
  chatButton: {
    marginBottom: 24,
  },
  chatIcon: {
    marginRight: 8,
  },
  statsCard: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  statValue: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightMedium,
    color: Colors.textPrimary,
    // marginBottom: 8,
  },
  statLabel: {
    fontSize: Fonts.base,
    color: Colors.textTertiary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.borderLight,
  },
  aboutCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightMedium,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: Fonts.base,
    color: Colors.textTertiary,
    // lineHeight: 24,
  },
  verificationCard: {
    marginBottom: 16,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 16,
    backgroundColor: Colors.gradientStart,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  verificationText: {
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    // fontWeight: Fonts.weightMedium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    marginTop: 16,
  },
});

export default UserProfileScreen;

