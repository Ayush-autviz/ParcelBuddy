import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  variant?: 'default' | 'centered';
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightAction,
  variant = 'centered',
  style,
  titleStyle,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const isCentered = variant === 'centered';

  return (
    <View style={[styles.container, style]}>
      {showBackButton ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButton} />
      )}

      <View style={[styles.titleContainer, isCentered && styles.titleContainerCentered]}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </View>

      {rightAction ? (
        <View style={styles.rightAction}>{rightAction}</View>
      ) : (
        <View style={styles.backButton} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    // paddingTop: 60,
    // paddingBottom: 20,
    backgroundColor: Colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  titleContainerCentered: {
    alignItems: 'center',
  },
  title: {
    fontSize: Fonts.xl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
  },
  rightAction: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

export default Header;

