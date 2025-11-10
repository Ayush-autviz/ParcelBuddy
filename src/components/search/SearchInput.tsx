import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { SvgXml } from 'react-native-svg';
import { MapPinIcon } from '../../assets/icons/svg/main';
import { CalendarIcon } from '../../assets/icons/svg/main';
import { TimeIcon } from '../../assets/icons/svg/main';
interface SearchInputProps extends Omit<TextInputProps, 'style'> {
  icon?: any;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
}

const SearchInput: React.FC<SearchInputProps> = ({
  icon: Icon,
  containerStyle,
  inputStyle,
  ...textInputProps
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {Icon && (
        <View style={styles.iconContainer}>
          {/* <Icon size={20} color={Colors.primaryTeal} /> */}
          <SvgXml xml={Icon} height={20} width={20} />
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
    paddingHorizontal: 16,
    minHeight: 50,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    paddingVertical: 14,
  },
});

export default SearchInput;

