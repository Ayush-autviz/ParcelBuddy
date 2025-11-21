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
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { User, Star, Check, MessageCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, Card, GradientButton } from '../../components';
import { ExtendedTrackStackParamList } from '../../navigation/TrackNavigator';
import { useProfileById } from '../../hooks/useProfile';
import { useCreateChatRoom } from '../../hooks/useChat';
import { useToast } from '../../components/Toast';
import { BottomTabParamList } from '../../navigation/BottomTabNavigator';

type SenderDetailScreenRouteProp = RouteProp<ExtendedTrackStackParamList, 'SenderDetail'>;
type SenderDetailScreenNavigationProp = StackNavigationProp<ExtendedTrackStackParamList, 'SenderDetail'>;

const SenderDetailScreen: React.FC = () => {
  const route = useRoute<SenderDetailScreenRouteProp>();
  const navigation = useNavigation<SenderDetailScreenNavigationProp>();
  const bottomTabNav = useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  const { sender, profileId: routeProfileId, luggageRequestId } = route.params;
  const { showSuccess, showError } = useToast();

  // Use profileId from route params if available, otherwise fallback to sender.profile.id
  const profileId = routeProfileId || (sender as any)?.profile?.id;
  const { data: profileDataResponse, isLoading, isError, error } = useProfileById(profileId);
  const createChatRoomMutation = useCreateChatRoom();

  // Extract the actual profile data from the API response
  const profileData = profileDataResponse?.profile || profileDataResponse;
  const currentProfile: any = profileData || sender;

  const firstName = currentProfile?.first_name || '';
  const lastName = currentProfile?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Sender';
  
  // Profile photo is nested: profileData.profile.profile.profile_photo
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
  const nestedProfile = currentProfile?.profile;
  const rating = nestedProfile?.average_rating || currentProfile?.average_rating || 0;
  const reviewCount = nestedProfile?.review_count || currentProfile?.review_count || nestedProfile?.total_reviews || 0;
  const about = nestedProfile?.bio || currentProfile?.bio || 'No bio available.';
  const isVerified = nestedProfile?.is_verified || currentProfile?.is_verified || nestedProfile?.verified || false;

  const handleChat = () => {
    if (!luggageRequestId) {
      showError('Luggage request ID is missing');
      return;
    }

    createChatRoomMutation.mutate(
      { luggage_request_id: luggageRequestId },
      {
        onSuccess: (response) => {
          console.log('Chat room created:', response);
          const chatRoomId = response?.id || response?.room_id || response?.chat_room_id;
          
          if (chatRoomId) {
            // Navigate to chat detail screen
            const senderFirstName = sender?.first_name || '';
            const senderLastName = sender?.last_name || '';
            const senderName = `${senderFirstName} ${senderLastName}`.trim() || 'Sender';
            const senderAvatar = sender?.profile?.profile_photo;
            
            // Navigate to Chat tab and then to ChatDetail
            bottomTabNav.navigate('Chat', {
              screen: 'ChatDetail',
              params: {
                roomId: chatRoomId,
                userName: senderName,
                userAvatar: senderAvatar,
                luggage_request_id: luggageRequestId,
              },
            });
          } else {
            showError('Failed to get chat room ID');
          }
        },
        onError: (error: any) => {
          console.error('Create chat room error:', error);
          showError(error?.response?.data?.message || 'Failed to create chat room. Please try again.');
        },
      }
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={20} color="#FFD700" fill="#FFD700" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <View key={i} style={styles.halfStarContainer}>
            <Star size={20} color="#FFD700" fill="#FFD700" />
            <View style={styles.halfStarOverlay} />
          </View>
        );
      } else {
        stars.push(
          <Star key={i} size={20} color="#E0E0E0" />
        );
      }
    }
    return stars;
  };

  // Show loading state
  if (isLoading && profileId) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Sender Detail" showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryCyan} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Sender Detail" showBackButton />

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
                <User size={60} color={Colors.primaryCyan} />
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
            {rating.toFixed(1)} ({reviewCount} reviews)
          </Text>
        </View>

        {/* Chat Button */}
        {/* <GradientButton
          title="Chat with Sender"
          onPress={handleChat}
          style={styles.chatButton}
          loading={createChatRoomMutation.isPending}
          disabled={createChatRoomMutation.isPending}
        /> */}

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
                <Check size={20} color={Colors.primaryCyan} />
              </View>
              <Text style={styles.verificationText}>Government ID Verified</Text>
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
    backgroundColor: Colors.primaryCyan + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primaryCyan,
  },
  userName: {
    fontSize: Fonts.xxl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  userAge: {
    fontSize: Fonts.base,
    color: Colors.textTertiary,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    color: Colors.textSecondary,
    fontWeight: Fonts.weightMedium,
  },
  chatButton: {
    marginBottom: 24,
  },
  aboutCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  verificationCard: {
    marginBottom: 16,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryCyan + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  verificationText: {
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    fontWeight: Fonts.weightMedium,
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

export default SenderDetailScreen;

