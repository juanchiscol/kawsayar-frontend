import React from "react";
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity, Platform } from "react-native";
import { router, useLocalSearchParams, Stack } from "expo-router";
import { homeStyles } from "@/styles/home-styles";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import InformacionYVideos from "@/components/Videos";
import ProgressBar from "@/components/ProgressBar"; // Importa el componente ProgressBar
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";

const Result = () => {
    const { resultado, imgrecortada, imagenoriginal, fecha, } = useLocalSearchParams();

    let predictionResult = null;

    if (resultado) {
        try {
            predictionResult = JSON.parse(decodeURIComponent(resultado as string));
        } catch (error) {
            console.error("Error parsing prediction result:", error);
        }
    }

    // Redondear la probabilidad de anemia a 2 decimales
    const probAnemia = predictionResult ? parseFloat(predictionResult.prob_anemia.toFixed(2)) : 0;

    // Crear un valor animado para la barra de progreso
    const progress = new Animated.Value(0);


    // Animar la barra de progreso
    React.useEffect(() => {
        if (predictionResult) {
            Animated.timing(progress, {
                toValue: probAnemia,
                duration: 1000, // Duración de la animación en milisegundos
                useNativeDriver: false,
            }).start();
        }
    },);

    return (
        <GestureHandlerRootView style={homeStyles.screen}>

            <Stack.Screen
                options={{
                    headerTitle: "RESULTADO DE LA CONSULTA",
                    headerStyle: {
                        backgroundColor: "#1E1E2C",
                      },
                      headerTintColor: "#AAAAAA",
                      headerTitleStyle: {
                        fontWeight: "bold",
                        fontFamily: "ArvoRegular",
                        fontSize: 18,
                      },
                    headerBackVisible: false,
                    gestureEnabled: false,
                    headerShown: true,
                    ...(Platform.OS === 'ios' && {
                        // Android-specific overrides
                        headerTitleAlign: 'center',
                        headerRight: () => (
                            <TouchableOpacity onPress={() => router.replace("/homeScreen")}>
                                <Ionicons name="home" size={30} color="#AAAAAA" />
                            </TouchableOpacity>
                        ),
                    }),
                    ...(Platform.OS === 'android' && {
                        // Android-specific overrides
                        headerTitleAlign: 'center',
                        headerStyle: { backgroundColor: "#1E1E2C" },
                        headerTintColor: "#AAAAAA",
                        gestureEnabled: false,
                        headerRight: () => (
                            <TouchableOpacity
                                onPress={() => router.replace("/homeScreen")}
                                style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
                            >
                                <Ionicons name="home" size={30} color="#fff" />
                            </TouchableOpacity>
                        )

                    }),
                }}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    {imagenoriginal && imgrecortada && (
                        <View style={{ position: "relative", alignItems: "center" }}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: decodeURIComponent(imagenoriginal as string) }}
                                    style={styles.capturedImage}
                                />
                                <Image
                                    source={{ uri: decodeURIComponent(imgrecortada as string) }}
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
                    )}

                    {/* Sección de probabilidad de anemia con ProgressBar */}
                    {predictionResult && (
                        <View style={styles.probabilityContainer}>
                            <Text style={styles.probabilityTitle}>Probabilidad de Anemia</Text>
                            {/* Usa el nuevo componente */}
                            <ProgressBar progress={progress} />
                            <Text style={styles.probabilityText}>
                                {(probAnemia * 100).toFixed(2)}% {/* Muestra el porcentaje */}
                            </Text>
                        </View>
                    )}

                    <View style={styles.siguienteControl}>
                        <Fontisto name="blood-drop" size={40} color="rgb(219, 74, 74)" />
                        <View>
                            <Text style={[styles.textMulti]}>
                                Fecha: <Text>{fecha || new Date().toLocaleDateString()}</Text>
                            </Text>
                            <Text style={[styles.textMulti]}>
                                Resultado:{" "}
                                <Text style={{ color: predictionResult?.result ? "rgb(219, 74, 74)" : "rgb(5, 147, 144)" }}>
                                    {predictionResult?.result ? "Con índices de anemia" : "Sin índices de anemia"}
                                </Text>
                            </Text>
                        </View>
                    </View>

                    <View style={styles.resultContainer}>
                        <Text style={styles.probabilityTitle}>Recomendacion</Text>
                        <Text style={styles.recommendationText}>
                            {predictionResult.descripcion_recomendacion}
                        </Text>
                    </View>

                    <InformacionYVideos />
                </View>

            </ScrollView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
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
    textMulti: {
        fontSize: 16,
        fontFamily: "ArvoRegular",
        marginLeft: 10,
        fontWeight: "bold",
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
    probabilityContainer: {
        backgroundColor: "#FFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
});

export default Result;