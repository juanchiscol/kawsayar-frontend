import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

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
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="historial"
                options={{
                    title: "Historial",
                    headerShown: false, // Desactivar encabezado para esta pantalla
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="time" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="education"
                options={{
                    title: "Educación",
                    headerShown: false, // Desactivar encabezado para esta pantalla
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="school" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="perfil"
                options={{
                    title: "Perfil",
                    headerShown: false, // Desactivar encabezado para esta pantalla
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}
