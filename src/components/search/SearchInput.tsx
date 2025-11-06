import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

interface SearchInputProps extends Omit<TextInputProps, 'style'> {
  icon?: React.ComponentType<{ size: number; color: string }>;
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
          <Icon size={20} color={Colors.primaryTeal} />
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

