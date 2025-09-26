import React from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { globalStyles } from '@/styles/global-styles';
import { Stack } from 'expo-router';
import { ProfileProvider } from "@/app/AppContext"; // Asegúrate de que la ruta sea correcta
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';

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
          <Stack>
           
          </Stack>
        </ThemeProvider>
      </View>
    </ProfileProvider>
  );
};

export default RootLayout;
