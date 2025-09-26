import { fetchControlesPorPerfil } from "@/apis/apis";
import { useProfile } from "@/app/AppContext";
import AnemiaChart from "@/components/AnemiaChart";
import InformacionYVideos from "@/components/Videos";
import { imageMapper } from "@/constants/imageMapper";
import { globalStyles } from "@/styles/global-styles";
import { homeStyles } from "@/styles/home-styles";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface Control {
  fecha_control: string;
  fecha_creacion: string;
  tiene_anemia: boolean;
  probabilidad_anemia: number;
}

const HomeScreen = () => {
  const { profile } = useProfile();
  const [controles, setControles] = useState<Control[]>([]);
  const [loading, setLoading] = useState(true);

  const id = profile?.id ?? 0;
  const nombres = profile?.nombres ?? "";
  const apellido_paterno = profile?.apellido_paterno ?? "";
  const apellido_materno = profile?.apellido_materno ?? "";
  const ft_perfil = profile?.ft_perfil ?? "";

  const fetchHistorial = useCallback(async () => {
    try {
      const controlesData = await fetchControlesPorPerfil(id);
      setControles(controlesData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (profile) fetchHistorial();
  }, [profile, fetchHistorial]);

  const ultimoControl = controles.length
    ? controles.reduce((a, b) =>
      new Date(a.fecha_control) > new Date(b.fecha_control) ? a : b
    )
    : null;

  const fechaUltimoControl = ultimoControl
    ? ultimoControl.fecha_control
    : "Sin registros";
  const tieneAnemia = ultimoControl ? ultimoControl.tiene_anemia : null;

  const formatearNombre = (
    nombre: string,
    apellido_paterno: string,
    apellido_materno: string
  ) => {
    const [primerNombre, ...otrosNombres] = nombre.split(" ");
    return `${primerNombre} ${otrosNombres
      .map((n) => `${n.charAt(0).toUpperCase()}.`)
      .join(" ")} ${apellido_paterno} ${apellido_materno
        .charAt(0)
        .toUpperCase()}.`;
  };

  const chartData = {
    labels: controles.map(c => {
      const f = new Date(c.fecha_creacion);
      return `${f.getDate().toString().padStart(2, "0")}/${(f.getMonth() + 1).toString().padStart(2, "0")}/${f.getFullYear()} ${f.getHours().toString().padStart(2, "0")}:${f.getMinutes().toString().padStart(2, "0")}`;
    }),
    datasets: [
      {
        data: controles.map(c => c.probabilidad_anemia * 100),
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 3,
      },
    ],
    legend: ["Evolución del Índice de Anemia"],
  };

  return (
    <View style={homeStyles.screen}>
      <Stack.Screen
        options={{
          title: "Home",
          headerShown: false,
        }}
      />  
      <StatusBar style="light" />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.loadingText}>Cargando información...</Text>
        </View>
      ) : (
        <>
          <View style={globalStyles.headerContainer}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="home" size={24} color="#AAAAAA" />
              <Text style={[globalStyles.titleapp, styles.headerTitleText]}>Inicio</Text>
            </View>
            <View style={homeStyles.profileContainer}>
              <View style={homeStyles.profileImageContainer}>
                <Image
                  source={imageMapper[ft_perfil] || imageMapper['default-profile.jpg']}
                  style={homeStyles.profileImage}
                />
              </View>
              <View style={homeStyles.profileInfo}>
                <Text style={homeStyles.nombretitle}>
                  {formatearNombre(nombres, apellido_paterno, apellido_materno)}
                </Text>
                <View style={homeStyles.subTileContainer}>
                  <Ionicons name="calendar" size={18} color="#fff" />
                  <Text style={{ ...homeStyles.subTile, marginLeft: 10 }}>{fechaUltimoControl}</Text>
                </View>
                <Text style={homeStyles.subTile}>
                  {tieneAnemia === null ? "Sin información de anemia" : tieneAnemia ? "Índices con Anemia" : "Sin índices de Anemia"}
                </Text>
              </View>
            </View>
            <View style={homeStyles.siguienteControl}>
              <Text style={homeStyles.text}>Siguiente control</Text>
              <TouchableOpacity style={homeStyles.button} onPress={() => router.push("/prediction")}>
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={homeStyles.scrollView}>
            <View style={homeStyles.sectionContainer}>
              <Text style={homeStyles.titleSection}>- Vista general</Text>
              {controles.length > 0 ? (
                <AnemiaChart data={chartData} />
              ) : (
                <Text style={homeStyles.titleExtra}>Sin datos para mostrar</Text>
              )}
            </View>
            <InformacionYVideos />
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#ccc",
    fontFamily: "ArvoRegular",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitleText: {
    marginLeft: 10,
  },
});

export default HomeScreen;
