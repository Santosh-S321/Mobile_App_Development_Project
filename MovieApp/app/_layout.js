import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/signup" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
        </Stack>
      </FavoritesProvider>
    </AuthProvider>
  );
}
