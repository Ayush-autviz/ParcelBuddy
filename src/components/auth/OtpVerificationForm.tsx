import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import GradientButton from '../GradientButton';
import { useToast } from '../Toast';

interface OtpVerificationFormProps {
  email: string;
  onVerifySuccess: (otp: string, response?: any) => void;
  verifyMutation: {
    mutate: (data: any, options?: any) => void;
    isPending: boolean;
  };
  resendMutation: {
    mutate: (data: any, options?: any) => void;
    isPending: boolean;
  };
  initialTimer?: number;
  verifyButtonText?: string;
  resendButtonText?: string;
}

const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
  email,
  onVerifySuccess,
  verifyMutation,
  resendMutation,
  initialTimer = 60,
  verifyButtonText = 'Verify OTP',
  resendButtonText = 'Resend OTP',
}) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(initialTimer);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
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

  // Timer effect - runs on mount
  useEffect(() => {
    startTimer(initialTimer);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Only run on mount

  // Effect to restart timer when it's reset (after resend)
  useEffect(() => {
    // Check if timer was just reset to initial value (resend case)
    // We detect this by checking if timer equals initialTimer and interval is not running
    if (timer === initialTimer && intervalRef.current === null && timer > 0) {
      startTimer(timer);
    }
  }, [timer, initialTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = () => {
    if (!otp || otp.length !== 6) {
      showWarning('Please enter a valid 6-digit OTP');
      return;
    }

    const cleanedOtp = otp.replace(/\D/g, '');

    verifyMutation.mutate(
      { email: email.trim(), otp: cleanedOtp },
      {
        onSuccess: (response: any) => {
          onVerifySuccess(cleanedOtp, response);
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
    console.log('Resending OTP to:', email);

    resendMutation.mutate(
      { email: email.trim() },
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
            error?.response?.data?.email?.[0] ||
            error?.response?.data?.detail ||
            error?.message || 
            'Failed to resend OTP. Please try again.';
          showError(errorMessage);
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* Description */}
      <Text style={styles.description}>
        Enter the 6-digit OTP sent to{'\n'}
        <Text style={styles.emailText}>{email}</Text>
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
            disabled={resendMutation.isPending}
            activeOpacity={0.7}
          >
            <Text style={styles.resendText}>
              {resendMutation.isPending ? 'Resending...' : resendButtonText}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Verify Button */}
      <GradientButton
        title={verifyMutation.isPending ? 'Verifying...' : verifyButtonText}
        onPress={handleVerify}
        loading={verifyMutation.isPending}
        style={styles.verifyButton}
        disabled={verifyMutation.isPending || otp.length !== 6}
      />
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
  emailText: {
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
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
});

export default OtpVerificationForm;

