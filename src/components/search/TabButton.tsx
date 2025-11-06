import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

interface TabButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
  style?: ViewStyle;
  isFirst?: boolean;
  isLast?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({
  label,
  active,
  onPress,
  style,
  isFirst = false,
  isLast = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.tab,
        isFirst && styles.tabFirst,
        isLast && styles.tabLast,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {active ? (
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.tabGradient, isFirst && styles.tabGradientFirst, isLast && styles.tabGradientLast]}
        >
          <Text style={styles.tabTextActive}>{label}</Text>
        </LinearGradient>
      ) : (
        <Text style={styles.tabTextInactive}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundWhite,
  },
  tabFirst: {
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
  },
  tabLast: {
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  },
  tabGradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  tabGradientFirst: {
    borderTopLeftRadius: 100  ,
    borderBottomLeftRadius: 100,
  },
  tabGradientLast: {
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  },
  tabTextActive: {
    color: Colors.textWhite,
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
  },
  tabTextInactive: {
    color: Colors.textPrimary,
    fontSize: Fonts.base,
    // fontWeight: Fonts.weightMedium,
  },
});

export default TabButton;

