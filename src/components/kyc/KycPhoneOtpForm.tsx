import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import PhoneInput from 'react-native-international-phone-number';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import GradientButton from '../GradientButton';
import { useToast } from '../Toast';

interface KycPhoneOtpFormProps {
  phone?: string;
  onVerifySuccess: (response?: any) => void;
  requestMutation: {
    mutate: (data: any, options?: any) => void;
    isPending: boolean;
  };
  verifyMutation: {
    mutate: (data: any, options?: any) => void;
    isPending: boolean;
  };
  initialTimer?: number;
}

// Helper function to parse phone number and determine country
const parsePhoneNumber = (phone: string | undefined): { number: string; country: string } => {
  if (!phone) return { number: '', country: 'US' };
  
  // Phone is stored as full number like +919418423051
  // Extract country code and determine country
  if (phone.startsWith('+1')) {
    return { number: phone.replace(/^\+1/, ''), country: 'US' };
  }
  if (phone.startsWith('+91')) {
    return { number: phone.replace(/^\+91/, ''), country: 'IN' };
  }
  if (phone.startsWith('+44')) {
    return { number: phone.replace(/^\+44/, ''), country: 'GB' };
  }
  if (phone.startsWith('+61')) {
    return { number: phone.replace(/^\+61/, ''), country: 'AU' };
  }
  if (phone.startsWith('+86')) {
    return { number: phone.replace(/^\+86/, ''), country: 'CN' };
  }
  if (phone.startsWith('+33')) {
    return { number: phone.replace(/^\+33/, ''), country: 'FR' };
  }
  if (phone.startsWith('+49')) {
    return { number: phone.replace(/^\+49/, ''), country: 'DE' };
  }
  if (phone.startsWith('+81')) {
    return { number: phone.replace(/^\+81/, ''), country: 'JP' };
  }
  if (phone.startsWith('+82')) {
    return { number: phone.replace(/^\+82/, ''), country: 'KR' };
  }
  
  // Try to extract country code (1-3 digits after +)
  const match = phone.match(/^\+(\d{1,3})(.+)/);
  if (match) {
    const countryCode = match[1];
    const number = match[2];
    // Default to US for unknown country codes
    return { number, country: 'US' };
  }
  
  // Default fallback
  return { number: phone.replace(/^\+\d+/, ''), country: 'US' };
};

const KycPhoneOtpForm: React.FC<KycPhoneOtpFormProps> = ({
  phone: initialPhone,
  onVerifySuccess,
  requestMutation,
  verifyMutation,
  initialTimer = 60,
}) => {
  // Parse phone number to get country and number
  const parsedPhone = parsePhoneNumber(initialPhone);
  const [phoneNumber, setPhoneNumber] = useState(parsedPhone.number);
  const [selectedCountry, setSelectedCountry] = useState(parsedPhone.country);
  
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [fullPhoneNumber, setFullPhoneNumber] = useState(initialPhone || '');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phoneInputRef = useRef<any>(null);
  const { showError, showSuccess, showWarning } = useToast();

  // Function to start the timer with a specific value
  const startTimer = (timerValue: number) => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Start timer if it's greater than 0
    if (timerValue > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Effect to restart timer when it's reset (after resend)
  useEffect(() => {
    if (timer === initialTimer && intervalRef.current === null && timer > 0) {
      startTimer(timer);
    }
  }, [timer, initialTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRequestOTP = () => {
    // Use the full phone number from profile (already formatted)
    const phoneNumber = initialPhone || fullPhoneNumber;
    
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      showWarning('Phone number not found. Please update your phone number in Edit Profile.');
      return;
    }
    
    setFullPhoneNumber(phoneNumber);

    requestMutation.mutate(
      { phone: phoneNumber },
      {
        onSuccess: () => {
          setOtpSent(true);
          setTimer(initialTimer);
          startTimer(initialTimer);
          showSuccess('OTP sent successfully!');
        },
        onError: (error: any) => {
          console.log('Error requesting OTP:', error);
          const errorMessage = 
            error?.response?.data?.message || 
            error?.response?.data?.error || 
            error?.response?.data?.detail ||
            error?.message || 
            'Failed to send OTP. Please try again.';
          showError(errorMessage);
        },
      }
    );
  };

  const handleVerify = () => {
    if (!otp || otp.length !== 6) {
      showWarning('Please enter a valid 6-digit OTP');
      return;
    }

    const cleanedOtp = otp.replace(/\D/g, '');

    verifyMutation.mutate(
      { otp: cleanedOtp },
      {
        onSuccess: (response: any) => {
          onVerifySuccess(response);
        },
        onError: (error: any) => {
          console.log('Error verifying OTP:', error);
          const errorMessage = 
            error?.response?.data?.message || 
            error?.response?.data?.error || 
            error?.response?.data?.detail ||
            error?.message || 
            'Invalid OTP. Please try again.';
          showError(errorMessage);
        },
      }
    );
  };

  const handleResendOTP = () => {
    if (!fullPhoneNumber) {
      showWarning('Please request OTP first');
      return;
    }

    requestMutation.mutate(
      { phone: fullPhoneNumber },
      {
        onSuccess: () => {
          // Clear existing interval, reset timer, and restart
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setTimer(initialTimer);
          // Manually restart the timer
          startTimer(initialTimer);
          showSuccess('OTP resent successfully!');
        },
        onError: (error: any) => {
          console.log('Error resending OTP:', error);
          const errorMessage = 
            error?.response?.data?.message || 
            error?.response?.data?.error || 
            error?.response?.data?.detail ||
            error?.message || 
            'Failed to resend OTP. Please try again.';
          showError(errorMessage);
        },
      }
    );
  };

  // Initialize full phone number from profile and parse it
  useEffect(() => {
    if (initialPhone) {
      setFullPhoneNumber(initialPhone);
      const parsed = parsePhoneNumber(initialPhone);
      setPhoneNumber(parsed.number);
      setSelectedCountry(parsed.country);
    }
  }, [initialPhone]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {!otpSent ? (
        <>
          {/* Rejection Message */}
          <View style={styles.rejectionCard}>
            <Text style={styles.rejectionTitle}>KYC Verification Rejected</Text>
            <Text style={styles.rejectionDescription}>
              Your previous KYC verification was not approved. Phone number verification is an alternative method to verify your identity.
            </Text>
          </View>

          {/* Phone Input Section */}
          <Text style={styles.description}>
            We'll send an OTP to your registered phone number
          </Text>

          <View style={styles.phoneInputWrapper} pointerEvents="box-none">
            <View pointerEvents="none">
              <PhoneInput
                ref={phoneInputRef}
                defaultValue={phoneNumber}
                value={phoneNumber}
                defaultCountry={selectedCountry as any}
                onChangePhoneNumber={() => {
                  // Disabled - phone number is not editable
                }}
                onChangeSelectedCountry={() => {
                  // Disabled - country is not editable
                }}
                editable={false}
                customCaret={() => null}
                phoneInputStyles={{
                  container: {
                    borderWidth: 0,
                    borderRadius: 12,
                    backgroundColor: Colors.backgroundGray,
                    height: 55,
                    opacity: 0.9,
                  },
                  flagContainer: {
                    borderWidth: 0,
                    borderRadius: 12,
                    backgroundColor: Colors.backgroundGray,
                  },
                  divider: {
                    display: 'none',
                  },
                  callingCode: {
                    display: 'none',
                  },
                  input: {
                    paddingLeft: -10,
                    color: Colors.textSecondary,
                  },
                }}
                placeholder="Phone number"
              />
            </View>
          </View>

          {/* Edit Profile Note */}
          <Text style={styles.editProfileNote}>
            Want to change your phone number? You can update it in{' '}
            <Text style={styles.editProfileLink}>Edit Profile</Text>
          </Text>

          <GradientButton
            title={requestMutation.isPending ? 'Sending...' : 'Send OTP'}
            onPress={handleRequestOTP}
            loading={requestMutation.isPending}
            style={styles.sendButton}
            disabled={requestMutation.isPending || !initialPhone || !fullPhoneNumber || initialPhone.trim().length === 0}
          />
        </>
      ) : (
        <>
          {/* OTP Verification Section */}
          <Text style={styles.description}>
            Enter the 6-digit OTP sent to{'\n'}
            <Text style={styles.phoneText}>{fullPhoneNumber}</Text>
          </Text>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            <OtpInput
              numberOfDigits={6}
              onTextChange={(text) => setOtp(text)}
              focusColor={Colors.primaryCyan}
              theme={{
                containerStyle: styles.otpInputContainer,
                pinCodeContainerStyle: styles.otpPinContainer,
                pinCodeTextStyle: styles.otpPinText,
              }}
            />
          </View>

          {/* Timer and Resend */}
          <View style={styles.resendContainer}>
            {timer > 0 ? (
              <Text style={styles.timerText}>
                Resend OTP in {formatTime(timer)}
              </Text>
            ) : (
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={requestMutation.isPending}
                activeOpacity={0.7}
              >
                <Text style={styles.resendText}>
                  {requestMutation.isPending ? 'Resending...' : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Verify Button */}
          <GradientButton
            title={verifyMutation.isPending ? 'Verifying...' : 'Verify OTP'}
            onPress={handleVerify}
            loading={verifyMutation.isPending}
            style={styles.verifyButton}
            disabled={verifyMutation.isPending || otp.length !== 6}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  description: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  phoneText: {
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
  },
  phoneInputWrapper: {
    marginBottom: 24,
  },
  sendButton: {
    marginBottom: 24,
  },
  otpContainer: {
    marginBottom: 24,
  },
  otpInputContainer: {
    width: '100%',
  },
  otpPinContainer: {
    width: 50,
    height: 55,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    backgroundColor: Colors.backgroundGray,
  },
  otpPinText: {
    fontSize: Fonts.xl,
    color: Colors.textPrimary,
    fontWeight: Fonts.weightBold,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
  },
  resendText: {
    fontSize: Fonts.sm,
    color: Colors.primaryCyan,
    fontWeight: Fonts.weightMedium,
  },
  verifyButton: {
    marginBottom: 24,
  },
  rejectionCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  rejectionTitle: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.error,
    marginBottom: 8,
  },
  rejectionDescription: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  editProfileNote: {
    fontSize: Fonts.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  editProfileLink: {
    color: Colors.primaryCyan,
    fontWeight: Fonts.weightMedium,
  },
});

export default KycPhoneOtpForm;

