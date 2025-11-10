import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight,  } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { SvgXml } from 'react-native-svg';
import { TimeIcon } from '../../assets/icons/svg/main';

interface SearchHistoryItemProps {
  from: string;
  to: string;
  date: string;
  onPress: () => void;
}

const SearchHistoryItem: React.FC<SearchHistoryItemProps> = ({
  from,
  to,
  date,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
     
     <SvgXml xml={TimeIcon} height={20} width={20} />
      <View style={styles.content}>
        <Text style={styles.route}>
          {from} → {to}
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <ChevronRight size={20} color={Colors.textPrimary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.05,
    // shadowRadius: 2,
    // elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryTeal + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  route: {
    fontSize: Fonts.base,
    // fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  date: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
  },
});

export default SearchHistoryItem;

