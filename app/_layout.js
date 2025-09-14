import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../utils/ThemeContext';
import { useEffect } from 'react';
import { registerSW } from '../utils/registerSW';

export default function RootLayout() {
  useEffect(() => {
    // Registrar Service Worker para PWA offline
    registerSW();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="add-sale" 
            options={{
              title: 'Nova Venda',
              presentation: 'modal',
              headerStyle: {
                backgroundColor: '#f8f9fa',
              },
              headerTitleStyle: {
                fontWeight: '600',
              },
            }}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
