# ParcelBuddy - React Native App Structure

This document outlines the project structure and setup for the ParcelBuddy React Native application.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Custom button component
│   ├── Card.tsx        # Card component for content
│   └── index.ts        # Component exports
├── contexts/           # React contexts for state management
│   └── AuthContext.tsx # Authentication context
├── navigation/         # Navigation setup
│   ├── AuthNavigator.tsx       # Stack navigator for auth screens
│   ├── BottomTabNavigator.tsx  # Bottom tab navigator
│   ├── RootNavigator.tsx       # Root navigator managing auth/app flow
│   └── index.ts        # Navigation exports
├── screens/           # Screen components
│   ├── Auth/
│   │   ├── LoginScreen.tsx
│   │   └── SignupScreen.tsx
│   ├── Home/
│   │   └── HomeScreen.tsx
│   ├── Profile/
│   │   └── ProfileScreen.tsx
│   ├── Settings/
│   │   └── SettingsScreen.tsx
│   └── Splash/
│       └── SplashScreen.tsx
├── services/          # API and external services
│   └── apiClient.ts   # Axios client with interceptors
└── index.ts          # Main exports
```

## Navigation Structure

### App Flow
1. **Splash Screen**: Animated loading screen (3 seconds)
2. **Authentication Flow**: Login/Signup screens (if not authenticated)
3. **Main App**: Bottom tab navigation (if authenticated)

### Authentication Navigation
- **Login Screen**: User login with email/password
- **Signup Screen**: User registration with validation

### Bottom Tab Navigation
- **Home Tab**: Main home screen with app overview
- **Profile Tab**: User profile and statistics
- **Settings Tab**: App settings and logout functionality

### Stack Navigation
Each tab can have its own stack navigation for nested screens.

## Authentication Flow

The app uses React Context for authentication state management:

- **AuthContext**: Provides login, signup, logout methods and user state
- **AsyncStorage**: Persists authentication tokens and user data
- **Automatic Navigation**: Switches between auth and main app based on login state

### Usage Example

```typescript
import { useAuth } from '../contexts/AuthContext';

const { login, logout, user, isAuthenticated } = useAuth();

// Login
const success = await login('user@example.com', 'password');

// Logout
await logout();
```

## API Client Setup

The app includes a configured Axios client with:

- **Request Interceptor**: Adds authentication tokens, logging
- **Response Interceptor**: Handles errors, token refresh, logging
- **Base Configuration**: Timeout, headers, base URL

### Usage Example

```typescript
import apiClient, { apiEndpoints } from '../services/apiClient';

// Make API calls
const response = await apiClient.get(apiEndpoints.parcels.list);
```

## Components

### Button Component
```typescript
import { Button } from '../components';

<Button
  title="Click Me"
  onPress={() => console.log('Pressed')}
  variant="primary"
  size="medium"
/>
```

### Card Component
```typescript
import { Card } from '../components';

<Card padding={16} shadow={true}>
  <Text>Card content</Text>
</Card>
```

## Getting Started

1. **Install Dependencies**: All navigation and axios dependencies are installed
2. **Run the App**:
   ```bash
   npm run android  # For Android
   npm run ios      # For iOS
   ```

## Customization

- **API Base URL**: Update in `src/services/apiClient.ts`
- **Navigation Structure**: Modify `src/navigation/`
- **Screens**: Add new screens in `src/screens/`
- **Components**: Create reusable components in `src/components/`

## Development Notes

- TypeScript is configured for type safety
- ESLint is set up for code quality
- Jest is configured for testing
- The app uses React Navigation v7 with native screen support
