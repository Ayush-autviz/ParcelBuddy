/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import notifee from '@notifee/react-native';

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;
    console.log('Background Action', type, detail);
    // Check if the user pressed the "Mark as read" action
    //   if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
    //     // Update external API
    //     await updateMessageStatue(notification.data.id, 'read');

    //     // Remove the notification
    //     await notifee.cancelNotification(notification.id);
    //   }
});

AppRegistry.registerComponent(appName, () => App);
