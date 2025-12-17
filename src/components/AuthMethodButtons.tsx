import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/fonts';

interface AuthMethodButtonsProps {
  onGooglePress: () => void;
  onEmailPress: () => void;
  onApplePress: () => void;
}

// Apple SVG (black Apple logo)
const AppleIcon = `
<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
<path d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z"></path>
</svg>
`;

// Google SVG (colorful Google logo)
const GoogleIcon = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.6 10.2273C19.6 9.51818 19.5364 8.83636 19.4182 8.18182H10V12.05H15.3818C15.15 13.3 14.4455 14.3591 13.3864 15.0682V17.5773H16.6182C18.5091 15.8364 19.6 13.2727 19.6 10.2273Z" fill="#4285F4"/>
<path d="M10 20C12.7 20 14.9636 19.1045 16.6182 17.5773L13.3864 15.0682C12.4909 15.6682 11.3455 16.0227 10 16.0227C7.39545 16.0227 5.19091 14.2636 4.40455 11.9H1.06364V14.4909C2.70909 17.7591 6.09091 20 10 20Z" fill="#34A853"/>
<path d="M4.40455 11.9C4.20455 11.3 4.09091 10.6591 4.09091 10C4.09091 9.34091 4.20455 8.7 4.40455 8.1V5.50909H1.06364C0.386364 6.85909 0 8.38636 0 10C0 11.6136 0.386364 13.1409 1.06364 14.4909L4.40455 11.9Z" fill="#FBBC05"/>
<path d="M10 3.97727C11.4682 3.97727 12.7864 4.48182 13.8227 5.47273L16.6909 2.60455C14.9591 0.990909 12.6955 0 10 0C6.09091 0 2.70909 2.24091 1.06364 5.50909L4.40455 8.1C5.19091 5.73636 7.39545 3.97727 10 3.97727Z" fill="#EA4335"/>
</svg>
`;

// Email SVG (colorful gradient email icon)
const EmailIcon = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.3333 3.33333H1.66667C0.75 3.33333 0 4.08333 0 5V15C0 15.9167 0.75 16.6667 1.66667 16.6667H18.3333C19.25 16.6667 20 15.9167 20 15V5C20 4.08333 19.25 3.33333 18.3333 3.33333ZM18.3333 6.66667L10 11.25L1.66667 6.66667V5L10 9.58333L18.3333 5V6.66667Z" fill="url(#emailGradient)"/>
<defs>
<linearGradient id="emailGradient" x1="0" y1="10" x2="20" y2="10" gradientUnits="userSpaceOnUse">
<stop stop-color="#3095CB"/>
<stop offset="1" stop-color="#4DBAA5"/>
</linearGradient>
</defs>
</svg>
`;

const AuthMethodButtons: React.FC<AuthMethodButtonsProps> = ({
  onGooglePress,
  onEmailPress,
  onApplePress,
}) => {
  return (
    <View style={styles.container}>
      {/* Apple Button - First */}
      <TouchableOpacity
        style={styles.button}
        onPress={onApplePress}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          <SvgXml xml={AppleIcon} width={20} height={20} />
          <Text style={styles.buttonText}>Continue with Apple</Text>
        </View>
      </TouchableOpacity>

      {/* Google Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={onGooglePress}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          <SvgXml xml={GoogleIcon} width={20} height={20} />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </View>
      </TouchableOpacity>

      {/* Email Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={onEmailPress}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          <SvgXml xml={EmailIcon} width={20} height={20} />
          <Text style={styles.buttonText}>Continue with Email</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.backgroundWhite,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
  },
});

export default AuthMethodButtons;

