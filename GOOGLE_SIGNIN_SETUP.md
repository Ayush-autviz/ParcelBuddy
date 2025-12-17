# Google Sign-In Setup Guide

This document outlines the setup for Google Sign-In on both Android and iOS platforms.

## Prerequisites

- Google Cloud Console project with OAuth 2.0 credentials configured
- Firebase project linked to your app
- `@react-native-google-signin/google-signin` package installed

## Configuration

### Web Client ID
The web client ID used in this project:
```
239698794881-mc60nuu984mpqqtne2eedf3v756he0oa.apps.googleusercontent.com
```

This is configured in:
- `src/services/googleSignIn.ts` - GoogleSignin.configure()
- `ios/ParcelBuddy/AppDelegate.swift` - GoogleSignIn.sharedInstance().clientID

## iOS Setup

### 1. Info.plist Configuration
✅ **Already configured** in `ios/ParcelBuddy/Info.plist`:
- Added reversed client ID URL scheme: `com.googleusercontent.apps.239698794881-mc60nuu984mpqqtne2eedf3v756he0oa`

### 2. AppDelegate Configuration
✅ **Already configured** in `ios/ParcelBuddy/AppDelegate.swift`:
- GoogleSignIn imported
- clientID set in `didFinishLaunchingWithOptions`
- URL handling in `application(_:open:options:)` method

### 3. GoogleService-Info.plist
✅ **Already present** at `ios/GoogleService-Info.plist`

### 4. Podfile
✅ **Already configured** - Firebase and GoogleUtilities pods are included

### 5. Next Steps for iOS:
1. Run `cd ios && pod install` to ensure all dependencies are installed
2. Make sure your bundle ID in Xcode matches: `com.app.parcelbuddy`
3. In Google Cloud Console, ensure the iOS OAuth client ID is configured with:
   - Bundle ID: `com.app.parcelbuddy`
   - URL scheme: `com.googleusercontent.apps.239698794881-mc60nuu984mpqqtne2eedf3v756he0oa`

## Android Setup

### 1. google-services.json
✅ **Already present** at `android/app/google-services.json`

### 2. build.gradle Configuration
✅ **Already configured**:
- `android/build.gradle` - Google Services plugin classpath
- `android/app/build.gradle` - Google Services plugin applied

### 3. AndroidManifest.xml
✅ **Already configured** - Internet permission is present

### 4. Next Steps for Android:
1. **Get SHA-1 Certificate Fingerprint:**
   ```bash
   # For debug keystore
   cd android
   ./gradlew signingReport
   ```
   Or manually:
   ```bash
   keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```

2. **Add SHA-1 to Firebase:**
   - Go to Firebase Console → Project Settings → Your Android App
   - Add the SHA-1 fingerprint from step 1
   - Download the updated `google-services.json` and replace the existing one

3. **Configure OAuth Client in Google Cloud Console:**
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Find or create OAuth 2.0 Client ID for Android
   - Package name: `com.parcelbuddy`
   - SHA-1: Add the fingerprint from step 1

4. **Rebuild the app:**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

## Testing

### Test Google Sign-In:
1. Run the app on a device or emulator
2. Navigate to the login screen
3. Tap "Continue with Google"
4. You should see the Google Sign-In flow

### Common Issues:

#### iOS:
- **"The operation couldn't be completed"**: Check that the bundle ID matches in Xcode and Google Cloud Console
- **URL scheme not working**: Verify Info.plist has the reversed client ID URL scheme

#### Android:
- **"DEVELOPER_ERROR"**: 
  - Verify SHA-1 is added to Firebase
  - Check package name matches in `google-services.json` and `build.gradle`
  - Ensure OAuth client is configured in Google Cloud Console
- **"10: "**: Usually means the SHA-1 fingerprint is missing or incorrect

## Code Usage

The Google Sign-In is implemented in:
- `src/services/googleSignIn.ts` - Service layer
- `src/hooks/useGoogleSignIn.ts` - React hook
- `src/screens/Auth/LoginScreen.tsx` - UI integration

### Example Usage:
```typescript
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';

const { signIn, isLoading } = useGoogleSignIn();

const handleGoogleSignIn = async () => {
  const result = await signIn();
  if (result) {
    // Send result.idToken to your backend
    console.log('User:', result.user);
  }
};
```

## Backend Integration

After successful Google Sign-In, you'll receive:
- `idToken`: JWT token to verify with Google
- `user`: User information (id, name, email, photo)
- `serverAuthCode`: For server-side authentication (if configured)

Send the `idToken` to your backend API endpoint for authentication.

