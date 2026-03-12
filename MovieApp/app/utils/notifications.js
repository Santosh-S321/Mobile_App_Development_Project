import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'CineTrack Notifications',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E50914',
    });
  }

  return finalStatus;
}

export async function sendTestNotification(title = 'CineTrack 🎬', body = 'Your weekly movie picks are ready!') {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { type: 'test' },
      sound: true,
    },
    trigger: { seconds: 2 },
  });
}

export async function scheduleWeeklyNotification() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'CineTrack Weekly Picks 🎬',
      body: 'New trending movies are available! Check out what\'s hot this week.',
      sound: true,
    },
    trigger: {
      weekday: 1, // Monday
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
}
