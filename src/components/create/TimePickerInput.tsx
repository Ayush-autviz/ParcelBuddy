import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Clock } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

interface TimePickerInputProps {
  value: Date | null;
  onChange: (time: Date) => void;
  placeholder?: string;
  containerStyle?: any;
}

const TimePickerInput: React.FC<TimePickerInputProps> = ({
  value,
  onChange,
  placeholder = 'Select Time',
  containerStyle,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedTime) {
      onChange(selectedTime);
      if (Platform.OS === 'ios') {
        setShowPicker(false);
      }
    }
  };

  const displayValue = value ? formatTime(value) : placeholder;

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Clock size={20} color={Colors.primaryTeal} strokeWidth={1.5}/>

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
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
          is24Hour={false}
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
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    paddingVertical: 14,
  },
  placeholderText: {
    color: Colors.textLight,
  },
});

export default TimePickerInput;

