import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { Clock } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

interface TimeInputProps extends Omit<TextInputProps, 'style'> {
  containerStyle?: any;
  inputStyle?: ViewStyle;
}

const TimeInput: React.FC<TimeInputProps> = ({
  containerStyle,
  inputStyle,
  ...textInputProps
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.iconContainer}>
        <Clock size={20} color={Colors.primaryTeal} />
      </View>
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
    flex: 1,
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

export default TimeInput;

