import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Animated, TouchableOpacity, ActivityIndicator } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { homeStyles } from "@/styles/home-styles";
import { fetchControlesPorPerfil } from "@/apis/apis";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import InformacionYVideos from "@/components/Videos";
import ProgressBar from "@/components/ProgressBar"; // Importa el nuevo componente

const DetalleControl = () => {
  const { perfilId, id } = useLocalSearchParams();
  interface Detalle {
    fecha_control: string;
    probabilidad_anemia: number;
    probabilidad_no_anemia: number;
    tiene_anemia: boolean;
    mejoro: boolean | null;
    ruta_imagen_original: string;
    ruta_imagen_preprocesada: string;
    descripcion_recomendacion: string;
  }

  const [detalle, setDetalle] = useState<Detalle | null>(null);
  const [progress] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (perfilId) {
      setLoading(true);
      fetchControlesPorPerfil(Number(perfilId))
        .then((controles) => {
          const control = controles.find((control: any) => control.id === parseInt(id as string));
          setDetalle(control);
          if (control) {
            Animated.timing(progress, {
              toValue: control.probabilidad_anemia,
              duration: 1000,
              useNativeDriver: false,
            }).start();
          }
        })
        .catch((error) => console.error("Error fetching controles:", error))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [perfilId, id, progress]);

  if (!detalle) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.loadingText}>Cargando información...</Text>
      </View>
    );
  }

  return (
    <View style={homeStyles.screen}>
      {/* Solo renderizar el Stack.Screen después de que los datos estén listos */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: `CONTROL / ${detalle.fecha_control}`,
          headerStyle: {
            backgroundColor: "#1E1E2C",
          },
          headerTintColor: "#AAAAAA",
          headerTitleStyle: {
            fontWeight: "bold",
            fontFamily: "ArvoRegular",
          },
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Ionicons name="arrow-back" size={24} color="#AAAAAA" />
            </TouchableOpacity>
          ),
        }}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.loadingText}>Cargando información...</Text>
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1, paddingBottom: 30 }}>

              <View style={{ position: "relative", alignItems: "center" }}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: decodeURIComponent(detalle.ruta_imagen_original as string) }}
                    style={styles.capturedImage}
                  />
                  <Image
                    source={{ uri: decodeURIComponent(detalle.ruta_imagen_preprocesada as string) }}
                    style={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      width: 140,
                      height: 80,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: "#fff",
                    }}
                  />
                </View>

                <Text style={[homeStyles.text, { marginVertical: 10, fontSize: 18 }]}>
                  Imagen tomada y recortada
                </Text>
              </View>

              <View style={styles.probabilityContainer}>
                <Text style={styles.probabilityTitle}>Probabilidad de Anemia</Text>
                {/* Usa el nuevo componente */}
                <ProgressBar progress={progress} />
                <Text style={styles.probabilityText}>
                  {(detalle.probabilidad_anemia * 100).toFixed(2)}%
                </Text>
              </View>

              <View style={styles.siguienteControl}>
                <Fontisto name="blood-drop" size={40} color="rgb(219, 74, 74)" />
                <View>
                  <Text style={[styles.textMulti]}>
                    Fecha: <Text>{detalle.fecha_control}</Text>
                  </Text>
                  <Text style={[styles.textMulti]}>
                    Resultado:{" "}
                    <Text style={{ color: detalle.tiene_anemia ? "rgb(219, 74, 74)" : "rgb(5, 147, 144)" }}>
                      {detalle.tiene_anemia ? "Con índices de anemia" : "Sin índices de anemia"}
                    </Text>
                  </Text>
                  <Text style={styles.textMulti}>
                    ¿Mejoró?:{" "}
                    <Text>
                      {detalle.mejoro === null ? "No evaluado" : detalle.mejoro ? "Sí" : "No"}
                    </Text>
                  </Text>
                </View>
              </View>

              <View style={styles.resultContainer}>
                <Text style={styles.probabilityTitle}>Recomendacion</Text>
                <Text style={styles.recommendationText}>
                  {detalle.descripcion_recomendacion}
                </Text>
              </View>
              <InformacionYVideos />
            </View>
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
    backgroundColor: "#1E1E2C", // Para que coincida con el color de fondo de la pantalla
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#ccc",
    fontFamily: "ArvoRegular",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 360,
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.27)",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  capturedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  probabilityContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
  },
  probabilityTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    fontFamily: "ArvoRegular",
  },
  probabilityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    textAlign: "center",
    fontFamily: "ArvoRegular",
  },
  resultContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "rgb(13, 107, 157)",
    fontFamily: "ArvoRegular",
  },
  siguienteControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(255, 255, 255)",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  textMulti: {
    fontSize: 15,
    marginLeft: 10,
    fontWeight: "bold",
    fontFamily: "ArvoRegular",
  },
});

export default DetalleControl;
