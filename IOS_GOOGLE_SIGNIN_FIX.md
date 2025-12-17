# iOS Google Sign-In Fix - "You must specify |clientID| in |GIDConfiguration|"

## Problem
The error occurs because the iOS Google Sign-In SDK requires a properly configured `GIDConfiguration` with an iOS Client ID.

## ✅ What We've Fixed

### 1. AppDelegate.swift
- ✅ Updated to use `GIDConfiguration(clientID:)` instead of deprecated `clientID` property
- ✅ Configured with iOS Client ID

### 2. Info.plist
- ✅ Added reversed client ID URL scheme: `com.googleusercontent.apps.239698794881-mc60nuu984mpqqtne2eedf3v756he0oa`

## ⚠️ CRITICAL: You Need to Do These Steps

### Step 1: Verify You Have iOS OAuth Client ID

The client ID you're using (`239698794881-mc60nuu984mpqqtne2eedf3v756he0oa.apps.googleusercontent.com`) appears to be a **Web Client ID**.

**You need a separate iOS OAuth Client ID:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `bagbuddy-a9ee7`
3. Navigate to: **APIs & Services** → **Credentials**
4. Look for **OAuth 2.0 Client IDs**
5. You should see:
   - **Web client** (for JavaScript/React Native `webClientId`)
   - **iOS client** (for native iOS SDK) ← **YOU NEED THIS ONE**

### Step 2: Update GoogleService-Info.plist

Your current `GoogleService-Info.plist` is missing the OAuth client configuration. You need to:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `bagbuddy-a9ee7`
3. Go to **Project Settings** → **Your apps** → **iOS app**
4. **Download** the latest `GoogleService-Info.plist`
5. Replace `ios/GoogleService-Info.plist` with the downloaded file

The new plist should contain:
```xml
<key>CLIENT_ID</key>
<string>YOUR_IOS_CLIENT_ID.apps.googleusercontent.com</string>
<key>REVERSED_CLIENT_ID</key>
<string>com.googleusercontent.apps.YOUR_CLIENT_ID</string>
```

### Step 3: Update AppDelegate.swift with iOS Client ID

Once you have the iOS Client ID, update `ios/ParcelBuddy/AppDelegate.swift`:

```swift
// Replace this line with your actual iOS Client ID
let iosClientId = "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com"
GoogleSignIn.sharedInstance.configuration = GIDConfiguration(clientID: iosClientId)
```

### Step 4: Update Info.plist with Correct REVERSED_CLIENT_ID

Update `ios/ParcelBuddy/Info.plist` with the REVERSED_CLIENT_ID from your GoogleService-Info.plist:

```xml
<key>CFBundleURLTypes</key>
<array>
    <!-- ... existing schemes ... -->
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>com.googleusercontent.apps.YOUR_CLIENT_ID</string>
        </array>
    </dict>
</array>
```

### Step 5: Verify GoogleService-Info.plist is in Xcode

1. Open `ios/ParcelBuddy.xcworkspace` in Xcode
2. Check if `GoogleService-Info.plist` is in the project navigator
3. If not:
   - Right-click project → **Add Files to "ParcelBuddy"**
   - Select `GoogleService-Info.plist`
   - ✅ Check **"Copy items if needed"**
   - ✅ Ensure it's added to **ParcelBuddy target**

### Step 6: Clean and Rebuild

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx react-native run-ios
```

## 🔍 How to Find Your iOS Client ID

### Option 1: From Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Find **OAuth 2.0 Client IDs**
4. Look for one with type **iOS**
5. Copy the **Client ID**

### Option 2: From GoogleService-Info.plist
If you download a fresh `GoogleService-Info.plist` from Firebase, it should contain:
- `CLIENT_ID` - This is your iOS Client ID
- `REVERSED_CLIENT_ID` - This is the reversed version for URL schemes

## 📝 Important Notes

1. **Web Client ID ≠ iOS Client ID**
   - Web Client ID: Used in `GoogleSignin.configure({ webClientId: ... })` in JavaScript
   - iOS Client ID: Used in `GIDConfiguration(clientID: ...)` in Swift

2. **Both are required:**
   - JavaScript side: `webClientId` in `googleSignIn.ts`
   - Native iOS side: `clientID` in `AppDelegate.swift`

3. **URL Scheme must match REVERSED_CLIENT_ID:**
   - Format: `com.googleusercontent.apps.CLIENT_ID_WITHOUT_SUFFIX`
   - Example: If iOS Client ID is `123-abc.apps.googleusercontent.com`
   - Then REVERSED_CLIENT_ID is `com.googleusercontent.apps.123-abc`

## ✅ Verification Checklist

- [ ] iOS OAuth Client ID created in Google Cloud Console
- [ ] GoogleService-Info.plist downloaded from Firebase (with CLIENT_ID)
- [ ] GoogleService-Info.plist added to Xcode project
- [ ] AppDelegate.swift uses iOS Client ID (not Web Client ID)
- [ ] Info.plist has correct REVERSED_CLIENT_ID URL scheme
- [ ] `pod install` completed successfully
- [ ] App rebuilt and tested

## 🐛 Still Getting the Error?

1. **Check Xcode console** for more detailed error messages
2. **Verify bundle ID** matches in:
   - Xcode project settings
   - Google Cloud Console OAuth client
   - GoogleService-Info.plist
3. **Check URL scheme** is exactly: `com.googleusercontent.apps.YOUR_CLIENT_ID`
4. **Ensure** GoogleService-Info.plist is in the app bundle (check Build Phases → Copy Bundle Resources)

