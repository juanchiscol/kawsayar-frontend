import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
// Componente para la pantalla Home
const HomeScreen = ({ color, size }: { color: string, size: number }) => (
  <Ionicons name="home" color={color} size={size} />
);

// Componente para la pantalla Historial
const HistorialScreen = ({ color, size }: { color: string, size: number }) => (
  <Ionicons name="time" color={color} size={size} />
);

// Componente para la pantalla Educación
const EducationScreen = ({ color, size }: { color: string, size: number }) => (
  <Ionicons name="school" color={color} size={size} />
);

// Componente para la pantalla Perfil
const PerfilScreen = ({ color, size }: { color: string, size: number }) => (
  <Ionicons name="person" color={color} size={size} />
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: 'rgb(37, 37, 48)', // Fondo del header
        },
        tabBarActiveTintColor: 'rgb(72, 187, 171)', // Color de los íconos y texto activos
        tabBarInactiveTintColor: 'rgb(255, 255, 255)', // Color de los íconos y texto inactivos
        tabBarLabelStyle: {
          fontFamily: "ArvoRegular",
        },
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'rgb(37, 37, 48)', // Fondo de la barra de pestañas
          },
          default: {
            backgroundColor: 'rgb(37, 37, 48)', // Fondo de la barra de pestañas
          },
        }),
      }}
    >
      <Tabs.Screen
        name="homeScreen"
        options={{
          title: "Inicio",
          headerShown: false, // Desactivar encabezado para esta pantalla
          tabBarIcon: HomeScreen, // Usar el componente como prop
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: "Historial",
          headerShown: false, // Desactivar encabezado para esta pantalla
          tabBarIcon: HistorialScreen, // Usar el componente como prop
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: "Educación",
          headerShown: false, // Desactivar encabezado para esta pantalla
          tabBarIcon: EducationScreen, // Usar el componente como prop
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          headerShown: false, // Desactivar encabezado para esta pantalla
          tabBarIcon: PerfilScreen, // Usar el componente como prop
        }}
      />
    </Tabs>
  );
}
