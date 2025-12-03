import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, Image } from 'react-native';
import { User, Star, MapPin } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import Card from '../Card';
import GradientButton from '../GradientButton';

export interface AvailableRideData {
  id: string;
  traveler: {
    first_name: string;
    last_name: string;
    profile?: {
      profile_photo?: string;
      id?: string;
      average_rating?: number;
    };
  };
  profileId?: string; // Profile ID from traveler.profile.id
  travel_date: string;
  origin_name: string;
  destination_name: string;
  available_weight_kg: string;
  price_per_kg?: string;
  rating?: number;
  review_count?: number;
}

interface AvailableRideCardProps {
  ride: AvailableRideData;
  onPress?: () => void;
  onSendRequest?: () => void;
  style?: ViewStyle;
}

const AvailableRideCard: React.FC<AvailableRideCardProps> = ({
  ride,
  onPress,
  onSendRequest,
  style,
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const driverName = `${ride.traveler.first_name} ${ride.traveler.last_name}`.trim();
  const formattedDate = formatDate(ride.travel_date);
  const availableWeight = parseFloat(ride.available_weight_kg).toFixed(0);
  // Use average_rating from profile if available, otherwise fallback to rating field
  const rating = ride.traveler.profile?.average_rating ?? ride?.rating ?? 0;
  const reviewCount = ride.review_count || 128; // Default review count if not provided

  return (
 
    <View style={[styles.container, style]}>
      <Card style={styles.card} padding={16}>
        <View style={styles.content}>
          {/* Left Side - Driver Info */}
          <View style={styles.leftSection}>
            <View style={styles.avatarContainer}>
              {ride.traveler.profile?.profile_photo ? (
                <Image
                  source={{ uri: ride.traveler.profile.profile_photo }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <User size={24} color={Colors.primaryCyan} />
                </View>
              )}
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{driverName}</Text>
              <Text style={styles.rideDate}>{formattedDate}</Text>
              <View style={styles.routeContainer}>
                {/* <MapPin size={14} color={Colors.primaryTeal} /> */}
                <Text style={styles.routeText}>
                  {ride.origin_name} → {ride.destination_name}
                </Text>
              </View>
            </View>
          </View>

          {/* Right Side - Capacity and Rating */}
          <View style={styles.rightSection}>
            <View style={styles.capacityContainer}>
              {availableWeight !== '0' ? (
                <>
               <Text style={styles.capacityValue}>{availableWeight}kg</Text>
              <Text style={styles.capacityLabel}>Available Capacity</Text>
              </>
              ) : (
                <Text style={styles.capacityValue}>Full</Text>
              )}

            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
              <Star size={14} color="#FFD700" fill="#FFD700" style={styles.starIcon} />
              {/* <Text style={styles.reviewCount}>({reviewCount})</Text> */}
            </View>
          </View>
        </View>

        {/* Send Request Button */}
        <GradientButton
          title="Send Request"
          onPress={onSendRequest || onPress || (() => {})}
          style={styles.requestButton}
          textStyle={styles.requestButtonText}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    shadowColor: '#D3D3D3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 24,
    backgroundColor: Colors.primaryTeal + '20',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryTeal + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInfo: {
    flex: 1
  },
  driverName: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    // marginBottom: 2,
  },
  rideDate: {
    fontSize: Fonts.xs,
    color: Colors.textTertiary,
    // marginBottom: 8,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeText: {
    fontSize: Fonts.sm,
    color: Colors.textPrimary,
    // marginLeft: 4,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  capacityContainer: {
    marginBottom: 4,
    alignItems: 'flex-end',
  },
  capacityValue: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightMedium,
    color: Colors.primaryCyan,
    marginBottom: 2,
  },
  capacityLabel: {
    fontSize: Fonts.xs,
    color: Colors.textTertiary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginRight: 4,
  },
  starIcon: {
    marginRight: 4,
  },
  reviewCount: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
  },
  requestButton: {
    marginTop: 0,
    height: 40,
    justifyContent: 'center',
  },
  requestButtonText: {
    fontSize: Fonts.base,
  },
});

export default AvailableRideCard;

