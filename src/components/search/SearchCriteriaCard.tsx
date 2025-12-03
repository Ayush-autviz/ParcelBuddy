import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import Card from '../Card';
import { SvgXml } from 'react-native-svg';
import { MapPinIcon } from '../../assets/icons/svg/main';
import { CalendarIcon } from '../../assets/icons/svg/main';

interface SearchCriteriaCardProps {
  from: string;
  to: string;
  date: string;
  onClear?: () => void;
}

const SearchCriteriaCard: React.FC<SearchCriteriaCardProps> = ({
  from,
  to,
  date,
  onClear,
}) => {
  return (
    <Card style={styles.card} padding={10}>
      <View style={styles.header}>
        {/* <Text style={styles.title}>Search Criteria</Text> */}
        {onClear && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <X size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.criteriaItem}>
        {/* <MapPin size={18} color={Colors.primaryTeal} /> */}
        <View style={styles.iconContainer}>
        <SvgXml xml={MapPinIcon} height={16} width={16} />
        </View>
        <View style={styles.criteriaContent}>
          <Text style={styles.criteriaLabel}>From</Text>
          <Text style={styles.criteriaValue}>{from}</Text>
        </View>
      </View>

      <View style={styles.criteriaItem}>
        {/* <MapPin size={18} color={Colors.primaryTeal} /> */}
        <View style={styles.iconContainer}>
        <SvgXml xml={MapPinIcon} height={16} width={16} />
        </View>
        <View style={styles.criteriaContent}>
          <Text style={styles.criteriaLabel}>To</Text>
          <Text style={styles.criteriaValue}>{to}</Text>
        </View>
      </View>

      <View style={styles.criteriaItem}>
        {/* <Calendar size={18} color={Colors.primaryTeal} /> */}
        <View style={styles.iconContainer}>
        <SvgXml xml={CalendarIcon} height={16} width={16} />
        </View>
        <View style={styles.criteriaContent}>
          <Text style={styles.criteriaLabel}>Date</Text>
          <Text style={styles.criteriaValue}>{date}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
  },
  clearButton: {
    padding: 4,
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  criteriaContent: {
    marginLeft: 12,
    flex: 1,
  },
  criteriaLabel: {
    fontSize: Fonts.xs,
    color: Colors.textTertiary,
    // marginBottom: 4,
  },
  criteriaValue: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightMedium,
    color: Colors.textPrimary,
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 100,
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchCriteriaCard;

