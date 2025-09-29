import { ProfileProvider } from "@/app/AppContext"; // Asegúrate de que la ruta sea correcta
import { useColorScheme } from '@/hooks/useColorScheme';
import { globalStyles } from '@/styles/global-styles';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const RootLayout = () => {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    PlayWrite: require('../assets/fonts/PlaywriteIN-Regular.ttf'),
    ArvoBold: require('../assets/fonts/Arvo-Bold.ttf'),
    ArvoRegular: require('../assets/fonts/Arvo-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ProfileProvider>
      <View style={globalStyles.container}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
           
          </Stack>
        </ThemeProvider>
      </View>
    </ProfileProvider>
  );
};

export default RootLayout;
