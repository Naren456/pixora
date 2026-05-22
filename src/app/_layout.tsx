import React, { useEffect, useState } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { initializeDatabase } from '@/database/sqlite';

// Keep the splash screen visible while setting up the database layer
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function setupApp() {
      try {
        // Initialize SQLite tables & structural indexes
        await initializeDatabase();
        setDbReady(true);
      } catch (error) {
        console.error('Critical Database Initialization Failure:', error);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    setupApp();
  }, []);

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}