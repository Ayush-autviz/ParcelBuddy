# Toast Component

An attractive, theme-matched toast notification component for ParcelBuddy.

## Features

- 🎨 Matches app theme with gradient colors
- ✨ Smooth slide-in/out animations
- 🎯 Multiple types: success, error, warning, info
- 📱 Responsive design
- ⏱️ Auto-dismiss with customizable duration
- 🎭 Beautiful icons from Lucide React Native
- 🔘 Manual dismiss option

## Usage

### Basic Setup

The `ToastProvider` is already integrated in `App.tsx`. Just use the `useToast` hook in any component:

```tsx
import { useToast } from '../../components/Toast';

const MyComponent = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleSuccess = () => {
    showSuccess('Operation completed successfully!');
  };

  const handleError = () => {
    showError('Something went wrong. Please try again.');
  };

  return (
    // Your component JSX
  );
};
```

### Available Methods

- `showSuccess(message, duration?)` - Green gradient with checkmark
- `showError(message, duration?)` - Red gradient with X icon
- `showWarning(message, duration?)` - Orange gradient with alert icon
- `showInfo(message, duration?)` - Blue/teal gradient with info icon
- `showToast(message, type, duration, position)` - Full control

### Examples

```tsx
// Success toast (default 3 seconds)
showSuccess('Ride created successfully!');

// Error toast with custom duration (5 seconds)
showError('Failed to load data', 5000);

// Warning toast
showWarning('Please check your input');

// Info toast
showInfo('New update available');

// Custom toast at bottom
showToast('Custom message', 'info', 4000, 'bottom');
```

## Styling

The toast automatically uses:
- App gradient colors (#3095CB to #4DBAA5)
- Theme colors for each type
- 12px border radius (matching app style)
- Shadow/elevation for depth
- Responsive width (screen width - 40px padding)

## Position

Toasts can be positioned at:
- `top` (default) - Appears from top
- `bottom` - Appears from bottom

