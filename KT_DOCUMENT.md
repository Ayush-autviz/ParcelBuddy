

## 1. Tech Stack

**Framework:** React Native (CLI) v0.82.1

**Language:** TypeScript

**Navigation:** React Navigation v7
- `@react-navigation/native`
- `@react-navigation/stack`
- `@react-navigation/bottom-tabs`
- `@react-navigation/native-stack`

**State Management:**
- Zustand v5.0.8 (global state)
- React Query v5.90.7 (API state)

**Styling:** StyleSheet (React Native)

**API Client:** Axios v1.13.1

---

## 2. Packages Installed (Grouped)

### Navigation
- `@react-navigation/native` ^7.1.19
- `@react-navigation/stack` ^7.6.1
- `@react-navigation/bottom-tabs` ^7.7.1
- `@react-navigation/native-stack` ^7.6.1

### State Management
- `zustand` ^5.0.8
- `@tanstack/react-query` ^5.90.7

### Storage
- `@react-native-async-storage/async-storage` ^2.2.0

### API
- `axios` ^1.13.1

### Auth
- `@react-native-google-signin/google-signin` ^16.0.0

### Firebase
- `@react-native-firebase/app` ^23.7.0
- `@react-native-firebase/messaging` ^23.7.0

### Notifications
- `@notifee/react-native` ^9.1.8

### UI Components
- `@gorhom/bottom-sheet` ^5.2.7
- `lucide-react-native` ^0.548.0
- `react-native-svg` ^15.14.0
- `react-native-linear-gradient` ^2.8.3
- `react-native-otp-entry` ^1.8.5

### Utilities
- `socket.io-client` ^4.8.1 (WebSocket)
- `react-native-geolocation-service` ^5.3.1
- `react-native-image-picker` ^8.2.1
- `react-native-gifted-chat` ^2.8.1

---

## 3. Folder Structure (Code-oriented)

```
src/
 ├── components/          # Reusable UI components
 │   ├── auth/           # Auth-specific components (OTP, etc.)
 │   ├── create/         # Create ride form components
 │   ├── search/         # Search screen components
 │   ├── track/          # Track screen components
 │   ├── Modal/          # Modal components
 │   ├── Toast/          # Toast notification system
 │   └── index.ts        # Component exports
 │
 ├── screens/            # Screen-level components
 │   ├── Auth/          # Authentication screens
 │   ├── Search/        # Search & booking screens
 │   ├── Create/        # Create ride screen
 │   ├── Track/         # Track rides & requests
 │   ├── Chat/          # Chat screens
 │   ├── Profile/       # Profile & settings screens
 │   └── Splash/        # Splash screen
 │
 ├── navigation/        # Navigation configuration
 │   ├── RootNavigator.tsx      # Root stack (Splash/Auth/MainApp)
 │   ├── AuthNavigator.tsx      # Auth flow stack
 │   ├── BottomTabNavigator.tsx # Main app tabs
 │   ├── SearchNavigator.tsx    # Search feature stack
 │   ├── TrackNavigator.tsx     # Track feature stack
 │   ├── ChatNavigator.tsx      # Chat feature stack
 │   ├── ProfileNavigator.tsx   # Profile feature stack
 │   ├── navigationRef.ts       # Navigation ref for programmatic navigation
 │   └── index.ts               # Navigation exports
 │
 ├── services/          # API & business logic
 │   ├── api/           # API service functions (auth, ride, chat, etc.)
 │   ├── apiClient.ts   # Authenticated axios instance
 │   ├── publicApiClient.ts # Public axios instance (no auth)
 │   ├── store.ts       # Zustand stores (auth, form state)
 │   └── geolocation.ts # Location utilities
 │
 ├── hooks/             # Custom React hooks
 │   ├── useAuthMutations.ts    # Auth mutations (login, signup, etc.)
 │   ├── useRides.ts            # Ride queries
 │   ├── useRideMutations.ts    # Ride mutations
 │   ├── useChat.ts             # Chat queries
 │   ├── useChatWebSocket.ts    # WebSocket chat hook
 │   ├── useSearchRides.ts      # Search ride queries
 │   └── ...                    # Other feature hooks
 │
 ├── contexts/          # React Context providers
 │   └── AuthContext.tsx        # Auth context (legacy, mostly replaced by Zustand)
 │
 ├── utils/             # Helper functions
 │   └── profileUtils.ts
 │
 ├── constants/         # App constants
 │   ├── colors.ts      # Color palette
 │   ├── fonts.ts       # Font sizes & weights
 │   └── svg.ts         # SVG icon exports
 │
 └── assets/            # Static assets
     ├── fonts/         # Custom fonts (Inter family)
     ├── icons/         # SVG icons
     └── images/        # Images & logos
```

---

## 4. Component Pattern

**Functional components only** - No class components

**Hooks over classes** - All state/logic via hooks

**Separation of concerns:**
- UI components in `components/`
- Business logic in `hooks/` and `services/`
- API calls only in `services/api/`

**Data flow pattern:**
```
Screen → Hook → Service → API
```

**Example:**
```typescript
// Screen
const SearchScreen = () => {
  const { data, isLoading } = useSearchRides();
  // ... render UI
};

// Hook (src/hooks/useSearchRides.ts)
export const useSearchRides = () => {
  return useQuery({
    queryKey: ['searchRides'],
    queryFn: () => searchRides(params)
  });
};

// Service (src/services/api/ride.ts)
export const searchRides = async (params) => {
  const response = await apiClient.get('/rides/search/', { params });
  return response.data;
};
```

---

## 5. State Management

### Global State (Zustand)
**Location:** `src/services/store.ts`

**Stores:**
1. **Auth Store** (`useAuthStore`)
   - `user`: User object
   - `token`: { access_token, refresh_token }
   - Persisted to AsyncStorage
   - Methods: `setUser()`, `setToken()`, `logout()`

2. **Search Form Store** (`useSearchFormStore`)
   - Form state for Search screen
   - Persisted: `from`, `to`, `selectedFrom`, `selectedTo`, coordinates

3. **Create Form Store** (`useCreateFormStore`)
   - Form state for Create screen
   - Persisted: `origin`, `destination`, `selectedOrigin`, `selectedDestination`, coordinates

### Local State
- Component-level state via `useState`
- Form state via Zustand stores (persisted)

### API State
- Managed by React Query
- Queries: `useQuery()` for GET requests
- Mutations: `useMutation()` for POST/PUT/DELETE
- Cache keys: `['publishedRides']`, `['chatList']`, `['unreadCount']`, etc.

---

## 6. API Integration

**Axios instance:** `src/services/apiClient.ts`

**Base URL:** Hardcoded in `apiClient.ts` and `publicApiClient.ts`
```typescript
const BaseURL = 'https://api.parcelbuddys.com'
```

**Request Interceptor:**
- Attaches `Authorization: Bearer {token}` header
- Token retrieved from `useAuthStore.getState().token?.access_token`
- Sets `baseURL` automatically

**Response Interceptor:**
- Handles 401 errors: Auto-refreshes token using refresh_token
- Handles 403 errors: Checks for `is_suspended`, navigates to Suspended screen
- On refresh failure: Logs out and navigates to Auth screen

**Public API Client:** `src/services/publicApiClient.ts`
- No auth token attached
- Used for public endpoints (login, signup, OTP)

**Service files:** `src/services/api/`
- `auth.ts` - Authentication endpoints
- `ride.ts` - Ride CRUD operations
- `chat.ts` - Chat endpoints
- `luggage.ts` - Luggage request endpoints
- `profile.ts` - Profile endpoints
- `subscription.ts` - Subscription endpoints
- `rating.ts` - Rating endpoints
- `places.ts` - Places/geocoding endpoints
- `kyc.ts` - KYC verification endpoints

---

## 7. Authentication Flow (Code Level)

**Auth state:** Managed by Zustand store (`useAuthStore`)

**Token storage:** AsyncStorage (via Zustand persist middleware)
- Storage key: `driver-auth-storage`
- Persists: `user` and `token` objects

**Login flow:**
1. User enters email/password or uses Google Sign-In
2. API call via `useLoginEmail()` or `useGoogleLogin()` hook
3. Response contains `access_token` and `refresh_token`
4. `useAuthStore.getState().setToken()` stores tokens
5. `useAuthStore.getState().setUser()` stores user data
6. RootNavigator checks `isAuthenticated` from `useAuth()` context
7. Navigates to `MainApp` stack

**Logout flow:**
1. `useAuthStore.getState().logout()` clears user & token
2. AsyncStorage cleared automatically (Zustand persist)
3. RootNavigator detects `!isAuthenticated`
4. Navigates to `Auth` stack

**Token refresh:**
- Automatic via axios interceptor on 401 errors
- Uses `refresh_token` to get new `access_token`
- Updates store with new token
- Retries original request

**Suspended users:**
- 403 response with `is_suspended: true` triggers logout
- Navigates to `Suspended` screen (no back navigation)

---

## 8. Navigation Structure

**Root Navigator** (`src/navigation/RootNavigator.tsx`)
```
RootNavigator
 ├── Splash (initial route)
 ├── Auth (AuthNavigator)
 ├── MainApp (BottomTabNavigator)
 └── Suspended
```

**Auth Navigator** (`src/navigation/AuthNavigator.tsx`)
```
AuthNavigator
 ├── Login
 ├── Signup
 ├── OTPScreen
 ├── ProfileSetup
 ├── EmailLogin
 ├── CreatePassword
 ├── ForgotPassword
 ├── VerifyResetOtp
 ├── ResetPassword
 └── AuthTermsPolicy
```

**Bottom Tab Navigator** (`src/navigation/BottomTabNavigator.tsx`)
```
BottomTabNavigator
 ├── Search (SearchNavigator)
 ├── Create (CreateScreen)
 ├── Track (TrackNavigator)
 ├── Chat (ChatNavigator)
 └── Profile (ProfileNavigator)
```

**Nested Stacks:**
- **SearchNavigator:** SearchList → PlacesSearch → AvailableRides → SendRequest → BookingStatus → BookingRequestDetail → UserProfile
- **TrackNavigator:** TrackList → RideDetail → BookingRequestDetail → LuggageRequestDetail → UserProfile → SenderDetail
- **ChatNavigator:** ChatList → ChatDetail
- **ProfileNavigator:** ProfileList → EditProfile → KYCVerification → KYCWebView → Support → TermsAndPolicy → PaymentHistory → Subscription → Ratings

**Deep linking:**
- Configured in `App.tsx` with `linking` prop
- Prefix: `parcelbuddy://`
- Handles payment deep links: `parcelbuddy://payment`
- Navigation handled via `navigationRef` in `App.tsx`

**Programmatic navigation:**
- Use `navigationRef` from `src/navigation/navigationRef.ts`
- Check `navigationRef.isReady()` before navigating
- Example: `navigationRef.dispatch(CommonActions.navigate(...))`

---

## 9. Reusable Patterns / Conventions

### Components
- **Common components** in `src/components/`
- **Feature-specific components** in subfolders (`components/search/`, `components/track/`, etc.)
- **Exports** via `components/index.ts` for clean imports

### API Calls
- **No inline API calls** in screens
- All API calls go through `services/api/` functions
- Hooks wrap service functions with React Query

### Constants
- **Colors:** `src/constants/colors.ts` - Use `Colors.primaryCyan`, `Colors.textPrimary`, etc.
- **Fonts:** `src/constants/fonts.ts` - Use `Fonts.base`, `Fonts.weightSemiBold`, etc.
- **No hardcoded values** - Use constants

### Toast Notifications
- **Provider:** `ToastProvider` in `App.tsx`
- **Usage:** `const { showSuccess, showError } = useToast()`
- **Types:** `success`, `error`, `warning`, `info`

### Form State Persistence
- Search and Create form states persist via Zustand
- Survives app restarts
- Cleared on logout (auth store)

### TypeScript
- **Type safety:** All navigators have typed param lists
- **Interfaces:** Defined in service files and component files
- **Exports:** Types exported alongside components

### React Query Patterns
- **Query keys:** Array format `['resourceName', ...params]`
- **Invalidation:** `queryClient.invalidateQueries({ queryKey: [...] })`
- **Refetch:** `queryClient.refetchQueries({ queryKey: [...] })`
- **Stale time:** 30 seconds default for some queries

### WebSocket
- **Chat WebSocket:** `src/hooks/useChatWebSocket.ts`
- **Connection:** Auto-connects on mount, disconnects on unmount
- **Reconnection:** Exponential backoff (max 5 attempts)
- **URL pattern:** `wss://api.parcelbuddys.com/ws/chat/{roomId}/?token={token}`

### Error Handling
- **API errors:** Handled in axios interceptors
- **UI errors:** Toast notifications via `useToast()`
- **Suspended users:** Automatic redirect to Suspended screen

### Code Organization
- **One feature per file** (mostly)
- **Hooks co-located** with feature logic
- **Services grouped** by domain (auth, ride, chat, etc.)
- **Screens organized** by feature area

---

## Additional Notes

### Firebase Integration
- **FCM tokens:** Sent to backend via `sendFcmToken()` API
- **Foreground notifications:** Handled in `App.tsx` with `@notifee/react-native`
- **Background notifications:** Handled by Firebase messaging

### Google Sign-In
- **Package:** `@react-native-google-signin/google-signin`
- **Hook:** `useGoogleSignIn()` in `src/hooks/useGoogleSignIn.ts`
- **Service:** `src/services/googleSignIn.ts`

### Image Handling
- **Picker:** `react-native-image-picker`
- **FormData:** Used for multipart uploads (profile photos, etc.)

### Geolocation
- **Service:** `react-native-geolocation-service`
- **Utilities:** `src/services/geolocation.ts`

### Bottom Sheet
- **Provider:** `BottomSheetModalProvider` in `App.tsx`
- **Package:** `@gorhom/bottom-sheet`

### Safe Area
- **Provider:** `SafeAreaProvider` in `App.tsx`
- **Package:** `react-native-safe-area-context`

---

**Node Version:** >=20 (see `package.json`)
