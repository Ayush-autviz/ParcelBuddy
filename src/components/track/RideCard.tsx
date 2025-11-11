import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { MapPin, Clock, User } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import StatusBadge, { StatusType } from './StatusBadge';
import GradientButton from '../GradientButton';
import { SvgXml } from 'react-native-svg';
import { FilledTimeIcon, FilledUserIcon, MapPinIcon } from '../../assets/icons/svg/main';


export interface RideCardData {
  id: string;
  status: StatusType;
  date: string;
  origin: string;
  originTime: string;
  destination: string;
  destinationTime: string;
  passengers: number;
  showRateButton?: boolean;
}

interface RideCardProps {
  ride: RideCardData;
  onPress?: () => void;
  onRatePress?: () => void;
  style?: ViewStyle;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onPress, onRatePress, style }) => {
  const renderPassengerIcons = () => {
    // return Array.from({ length: ride.passengers }).map((_, index) => (
      return Array.from({ length: 3 }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.passengerAvatar,
          index > 0 && styles.passengerAvatarOverlap,
        ]}
      >
        {/* <User size={16} color={Colors.gradientEnd} /> */}
        <SvgXml xml={FilledUserIcon} height={16} width={16} />
      </View>
    ));
  };

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <StatusBadge status={ride.status} />
        <View></View>
        <Text style={styles.date}>{ride.date}</Text>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeRow}>
          <View style={styles.iconWrapper}>
            {/* <MapPin size={16} color={Colors.primaryTeal} /> */}
            <SvgXml xml={MapPinIcon} height={16} width={16} />
          </View>
          <Text style={styles.routeText}>{ride.origin}</Text>
          <View style={styles.separatorWrapper}>
            <Text style={styles.separator}>•</Text>
          </View>
          <View style={styles.timeIconWrapper}>
            {/* <Clock size={14} color={Colors.primaryTeal} /> */}
            <SvgXml xml={FilledTimeIcon} height={14} width={14} />
          </View>
          <Text style={styles.timeText}>{ride.originTime}</Text>
        </View>

        <View style={styles.routeRow}>
          <View style={styles.iconWrapper}>
            {/* <MapPin size={16} color={Colors.primaryTeal} /> */}
            <SvgXml xml={MapPinIcon} height={16} width={16} />
          </View>
          <Text style={styles.routeText}>{ride.destination}</Text>
          <View style={styles.separatorWrapper}>
            <Text style={styles.separator}>•</Text>
          </View>
          <View style={styles.timeIconWrapper}>
            {/* <Clock size={14} color={Colors.primaryTeal} /> */}
            <SvgXml xml={FilledTimeIcon} height={14} width={14} />
          </View>
          <Text style={styles.timeText}>{ride.destinationTime}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.passengersContainer}>
          {renderPassengerIcons()}
        </View>
        {ride.showRateButton && onRatePress && (
          <GradientButton
            title="Rate"
            onPress={onRatePress}
            style={styles.rateButton}
            textStyle={styles.rateButtonText}
          />
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
  date: {
    fontSize: Fonts.sm,
    color: Colors.primaryCyan,
    fontWeight: Fonts.weightMedium,
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
});

export default RideCard;

