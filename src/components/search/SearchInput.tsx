import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TextInputProps, TextStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { SvgXml } from 'react-native-svg';
import { MapPinIcon } from '../../assets/icons/svg/main';
import { CalendarIcon } from '../../assets/icons/svg/main';
import { TimeIcon } from '../../assets/icons/svg/main';
interface SearchInputProps extends Omit<TextInputProps, 'style'> {
  icon?: any;
  lucideIcon?: any;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

const SearchInput: React.FC<SearchInputProps> = ({
  icon: Icon,
  lucideIcon: LucideIcon,
  containerStyle,
  inputStyle,
  ...textInputProps
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {Icon && (
        <View style={styles.iconContainer}>
          <SvgXml xml={Icon} height={20} width={20} />
        </View>
      )}
      {LucideIcon && (
        <View style={styles.lucideIconContainer}>
          <LucideIcon size={20} color={Colors.primaryTeal} strokeWidth={1.5} />
        </View>
      )}

      <TextInput
        style={[styles.input, inputStyle]}
        placeholderTextColor={Colors.textLight}
        {...textInputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    backgroundColor: Colors.backgroundWhite,
    paddingHorizontal: 10,
    minHeight: 50,
  },
  iconContainer: {
    marginRight: 12,
  },
  lucideIconContainer: {
    marginRight: 2,
  },
  input: {
    flex: 1,
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    paddingVertical: 14,
  },
});

export default SearchInput;

