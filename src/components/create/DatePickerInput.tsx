import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { SvgXml } from 'react-native-svg';
import { CalendarIcon } from '../../assets/icons/svg/main';

interface DatePickerInputProps {
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  containerStyle?: any;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  onChange,
  placeholder = 'Select Date',
  minimumDate,
  maximumDate,
  containerStyle,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month} / ${day} / ${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
      if (Platform.OS === 'ios') {
        setShowPicker(false);
      }
    }
  };

  const displayValue = value ? formatDate(value) : placeholder;

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          {/* <Calendar size={20} color={Colors.primaryTeal} /> */}
          <SvgXml xml={CalendarIcon} height={20} width={20} />
        </View>
        <Text
          style={[
            styles.text,
            !value && styles.placeholderText,
          ]}
        >
          {displayValue}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
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
  text: {
    flex: 1,
    fontSize: Fonts.sm,
    color: Colors.textPrimary,
    paddingVertical: 14,
  },
  placeholderText: {
    color: Colors.textLight,
  },
});

export default DatePickerInput;

