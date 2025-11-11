import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal } from 'react-native';
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
      // Don't close on iOS - let user click Done
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

      {Platform.OS === 'ios' ? (
        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setShowPicker(false)}
                  style={styles.modalCancelButton}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Time</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (value) {
                      setShowPicker(false);
                    }
                  }}
                  style={styles.modalDoneButton}
                >
                  <Text style={[styles.modalDoneText, !value && styles.modalDoneTextDisabled]}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.timePickerContainer}>
                <DateTimePicker
                  value={value || new Date()}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                  is24Hour={false}
                  textColor={Colors.textPrimary}
                  style={styles.timePicker}
                />
              </View>
            </View>
          </View>
        </Modal>
      ) : (
        showPicker && (
          <DateTimePicker
            value={value || new Date()}
            mode="time"
            display="default"
            onChange={handleTimeChange}
            is24Hour={false}
          />
        )
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
    marginRight: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.backgroundWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  modalCancelText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    fontWeight: Fonts.weightMedium,
  },
  modalTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  modalDoneButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  modalDoneText: {
    fontSize: Fonts.base,
    color: Colors.primaryCyan,
    fontWeight: Fonts.weightSemiBold,
  },
  modalDoneTextDisabled: {
    color: Colors.textLight,
    opacity: 0.5,
  },
  timePickerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
  },
  timePicker: {
    width: '100%',
    height: 200,
  },
});

export default TimePickerInput;

