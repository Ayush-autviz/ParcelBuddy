import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
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

type UserProfileScreenRouteProp = RouteProp<SearchStackParamList, 'UserProfile'>;
type UserProfileScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'UserProfile'>;

const UserProfileScreen: React.FC = () => {
  const route = useRoute<UserProfileScreenRouteProp>();
  const navigation = useNavigation<UserProfileScreenNavigationProp>();
  const { traveler } = route.params;

  const firstName = traveler?.first_name || '';
  const lastName = traveler?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Traveler';
  const profilePhoto = traveler?.profile?.profile_photo;
  const age = traveler?.profile?.age || 28; // Default age if not available
  const rating = traveler?.profile?.rating || 4.8;
  const reviewCount = traveler?.profile?.review_count || 127;
  const ridesPublished = traveler?.profile?.rides_published || 24;
  const ridesCompleted = traveler?.profile?.rides_completed || 89;
  const about = traveler?.profile?.about || 'Experienced rideshare traveler who loves meeting new people and exploring different cities. Always punctual and friendly. Non-smoker with a clean, comfortable vehicle.';
  const isVerified = traveler?.profile?.is_verified || true;

  const handleChat = () => {
    // TODO: Navigate to chat screen
    console.log('Chat with traveler:', fullName);
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
        // For half star, we'll show a filled star with reduced opacity for the empty part
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
            {rating} ({reviewCount} reviews)
          </Text>
        </View>

        {/* Chat Button */}
        <GradientButton
          title="Chat with Traveller"
          onPress={handleChat}
          style={styles.chatButton}
          icon={<MessageCircle size={20} color={Colors.textWhite} style={styles.chatIcon} />}
        />

        {/* Statistics Card */}
        <Card style={styles.statsCard} padding={20}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{ridesPublished}</Text>
              <Text style={styles.statLabel}>Rides published</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{ridesCompleted}</Text>
              <Text style={styles.statLabel}>Rides completed</Text>
            </View>
          </View>
        </Card>

        {/* About Section */}
        <Card style={styles.aboutCard} padding={20}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{about}</Text>
        </Card>

        {/* Verification Section */}
        <Card style={styles.verificationCard} padding={20}>
          <Text style={styles.sectionTitle}>Verification</Text>
          <View style={styles.verificationRow}>
            <View style={styles.checkIconContainer}>
              <Check size={20} color={Colors.primaryCyan} />
            </View>
            <Text style={styles.verificationText}>Government ID Verified</Text>
          </View>
        </Card>
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
  chatIcon: {
    marginRight: 8,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: Fonts.xxl,
    fontWeight: Fonts.weightBold,
    color: Colors.primaryCyan,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
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
});

export default UserProfileScreen;

