import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, Image } from 'react-native';
import { MapPin, Clock, User, Trash2 } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import StatusBadge, { StatusType } from './StatusBadge';
import GradientButton from '../GradientButton';
import { SvgXml } from 'react-native-svg';
import { FilledTimeIcon, FilledUserIcon, MapPinIcon } from '../../assets/icons/svg/main';


export interface RideCardData {
  id: string;
  availableWeight?: string;
  status: StatusType;
  date: string;
  origin: string;
  originTime: string;
  destination: string;
  destinationTime: string;
  passengers: number;
  showRateButton?: boolean;
  isRated?: boolean;
  requestCount?: number;
  pendingRequestCount?: number;
  travelerName?: string;
  approvedSenders?: Array<{
    profilePhoto?: string | null;
  }>;
  travelerProfilePhoto?: string | null;
  activeRideCount?: number;
}

interface RideCardProps {
  ride: RideCardData;
  onPress?: () => void;
  onRatePress?: () => void;
  onDeletePress?: () => void;
  style?: ViewStyle;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onPress, onRatePress, onDeletePress, style }) => {
  // Check if this is a booked ride (has bookingRequest property)
  const isBookedRide = 'bookingRequest' in ride && (ride as any).bookingRequest !== undefined;

  const renderPassengerIcons = () => {
    // For booked rides, allow showing the traveler's photo if available
    if (isBookedRide) {
      if (ride.travelerProfilePhoto) {
        return (
          <View style={styles.passengerAvatar}>
            <Image
              source={{ uri: ride.travelerProfilePhoto }}
              style={{ width: '100%', height: '100%', borderRadius: 16 }}
              resizeMode="cover"
            />
          </View>
        );
      }
      // If no photo, show fallback user icon
      return (
        <View style={styles.passengerAvatar}>
          <SvgXml xml={FilledUserIcon} height={16} width={16} />
        </View>
      );
    }

    // Use approvedSenders if available, otherwise fallback to counts
    const senders = ride.approvedSenders || [];

    // If we have approved senders, render their photos
    if (senders.length > 0) {
      const displayCount = Math.min(senders.length, 3); // Show max 3 icons

      return senders.slice(0, displayCount).map((sender, index) => (
        <View
          key={index}
          style={[
            styles.passengerAvatar,
            index > 0 && styles.passengerAvatarOverlap,
          ]}
        >
          {sender.profilePhoto ? (
            <Image
              source={{ uri: sender.profilePhoto }}
              style={{ width: '100%', height: '100%', borderRadius: 16 }}
              resizeMode="cover"
            />
          ) : (
            <SvgXml xml={FilledUserIcon} height={16} width={16} />
          )}
        </View>
      ));
    }

    // Fallback to existing logic if no approvedSenders array provided
    // Use requestCount if available, otherwise fall back to passengers or default to 0
    const count = ride.requestCount !== undefined ? ride.requestCount : (ride.passengers || 0);
    const displayCount = Math.min(count, 3); // Show max 3 icons

    if (displayCount === 0) {
      return null;
    }

    return Array.from({ length: displayCount }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.passengerAvatar,
          index > 0 && styles.passengerAvatarOverlap,
        ]}
      >
        <SvgXml xml={FilledUserIcon} height={16} width={16} />
      </View>
    ));
  };

  console.log('ride.travelerName', ride.travelerName);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <StatusBadge status={ride.status} />
          {ride.pendingRequestCount !== undefined && ride.pendingRequestCount > 0 && ride.status !== 'completed' && (
            <Text style={styles.pendingText}>{ride.pendingRequestCount} pending</Text>
          )}
          {ride.activeRideCount !== undefined && ride.activeRideCount > 0 && (
            <View style={styles.activeRideBadge}>
              <Text style={styles.activeRideBadgeText}>{ride.activeRideCount} active rides</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.date}>{ride.date}</Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeRow}>
          <View style={styles.iconWrapper}>
            <SvgXml xml={MapPinIcon} height={16} width={16} />
          </View>
          <Text style={styles.routeText}>{ride.origin}</Text>
          {/* <View style={styles.separatorWrapper}>
            <Text style={styles.separator}>•</Text>
          </View>
          <View style={styles.timeIconWrapper}>
            <SvgXml xml={FilledTimeIcon} height={14} width={14} />
          </View>
          <Text style={styles.timeText}>{ride.originTime}</Text> */}
        </View>

        <View style={styles.routeRow}>
          <View style={styles.iconWrapper}>
            <SvgXml xml={MapPinIcon} height={16} width={16} />
          </View>
          <Text style={styles.routeText}>{ride.destination}</Text>
          {/* <View style={styles.separatorWrapper}>
            <Text style={styles.separator}>•</Text>
          </View>
          <View style={styles.timeIconWrapper}>
            <SvgXml xml={FilledTimeIcon} height={14} width={14} />
          </View>
          <Text style={styles.timeText}>{ride.destinationTime}</Text> */}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.passengersContainer}>
          {renderPassengerIcons()}
          {ride.travelerName && (
            <Text style={styles.travelerName}>{ride.travelerName}</Text>
          )}
        </View>
        {onDeletePress && ride.status !== 'cancelled' && (
          <TouchableOpacity onPress={onDeletePress} style={styles.footerCancelButton}>
            <Trash2 size={16} color="#FF5C5C" />
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
        {ride.showRateButton && (isBookedRide || ride.status === 'completed') && (
          ride.isRated ? (
            <></>
          ) : onRatePress ? (
            <GradientButton
              title="Rate"
              onPress={onRatePress}
              style={styles.rateButton}
              textStyle={styles.rateButtonText}
            />
          ) : null
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#D3D3D3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pendingText: {
    fontSize: Fonts.sm,
    color: '#FF5C5C',
    fontWeight: Fonts.weightMedium,
  },
  activeRideBadge: {
    backgroundColor: 'rgba(77, 186, 165, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(77, 186, 165, 0.2)',
  },
  activeRideBadgeText: {
    fontSize: 11,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.primaryTeal,
  },
  date: {
    fontSize: Fonts.sm,
    color: Colors.primaryCyan,
    fontWeight: Fonts.weightMedium,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    padding: 4,
  },
  routeContainer: {
    // marginBottom: 16,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconWrapper: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeText: {
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    // fontWeight: Fonts.weightMedium,
    marginRight: 8,
  },
  separatorWrapper: {
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
  },
  timeIconWrapper: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  timeText: {
    fontSize: Fonts.sm,
    color: Colors.textPrimary,
    // fontWeight: Fonts.weightMedium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passengersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  travelerName: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    fontWeight: Fonts.weightSemiBold,
    marginLeft: 4,
    maxWidth: 150, // Limit width properly
  },
  passengerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundWhite,
    borderWidth: 2,
    borderColor: Colors.backgroundWhite,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A9A9A9',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  footerCancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FFF1F1',
  },
  cancelText: {
    fontSize: Fonts.xs,
    color: '#FF5C5C',
    fontWeight: Fonts.weightSemiBold,
  },
  passengerAvatarOverlap: {
    marginLeft: -12,
  },
  rateButton: {
    minWidth: 80,
    justifyContent: 'center',
    height: 36,
    borderRadius: 100,
  },
  rateButtonText: {
    fontSize: Fonts.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 16,
  },
  ratedText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textSecondary,
  },
});

export default RideCard;

