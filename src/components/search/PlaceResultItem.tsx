import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

export interface PlaceResultItemData {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

interface PlaceResultItemProps {
  place: PlaceResultItemData;
  onPress: () => void;
}

const PlaceResultItem: React.FC<PlaceResultItemProps> = ({ place, onPress }) => {
  const displayText = place.address || place.name;
  const subText = place.city || place.country;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <MapPin size={18} color={Colors.primaryTeal} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.primaryText} numberOfLines={1}>
          {displayText}
        </Text>
        {subText && (
          <Text style={styles.secondaryText} numberOfLines={1}>
            {subText}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  primaryText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightMedium,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  secondaryText: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
  },
});

export default PlaceResultItem;

