import { fetchControlesPorPerfil, recortarImagen, validateConjuntiva } from "@/apis/apis";
import { useProfile } from "@/app/AppContext";
import ImagePickerButton from "@/components/Camara/ImagePickerButton";
import ImagePreviewWithRecommendations from "@/components/ImagePreviewWithRecommendations";
import ImgrecortadaModal from "@/components/Modals/ImgrecortadaModal";
import RecommendationOverlay from "@/components/Modals/RecommendationOverlay";
import { homeStyles } from "@/styles/home-styles";
import { predictionStyles } from "@/styles/prediction-styles";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const Prediction = () => {
    const { profile } = useProfile();
    const { id } = profile ?? {};
    const [remainingTime, setRemainingTime] = useState<number>(0); // Tiempo restante en segundos
    const [loading, setLoading] = useState<boolean>(false);
    const [isCameraAndGalleryEnabled, setIsCameraAndGalleryEnabled] = useState<boolean>(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [mesagge, setMesagge] = useState<string>("");
    const [respuesta, setRespuesta] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [isImageValid, setIsImageValid] = useState<boolean>(false); // Estado para controlar si la imagen es válida
    const imageContainerRef = useRef<View>(null!);
    const silhouetteImage = require("@/assets/images/silueta.png");
    const [recomendacionAceptada, setRecomendacionAceptada] = useState(false);
    const [ultimoControlData, setUltimoControlData] = useState<any>(null);

    const showToast = (type: "error" | "success", message: string) => {
        Toast.show({
            type,
            position: "top",
            text2: message,
            visibilityTime: 3000,
            autoHide: true,
            text2Style: {
                fontSize: 16,
                color: "#333",
                fontWeight: "normal",
                fontFamily: "ArvoRegular",
            },
        });
    };

    // Función para verificar el último control y calcular el tiempo restante
    const checkLastControlTime = useCallback(async () => {
        if (!id) {
            console.error("El id del perfil no está definido");
            setIsCameraAndGalleryEnabled(true);
            setRemainingTime(0);
            return;
        }

        try {
            const result = await fetchControlesPorPerfil(id);

            if (!result.length) {
                setIsCameraAndGalleryEnabled(true);
                setUltimoControlData({ tiene_anemia: 0, probabilidad_anemia: 0 });
                setRemainingTime(0);
                return;
            }

            const lastControl = result[result.length - 1];
            const lastControlTime = new Date(lastControl.fecha_creacion);

            if (isNaN(lastControlTime.getTime())) {
                throw new Error("Fecha de control no válida");
            }

            setUltimoControlData({
                tiene_anemia: lastControl.tiene_anemia,
                probabilidad_anemia: lastControl.probabilidad_anemia ?? 0,
            });

            const timeElapsedInSeconds = (Date.now() - lastControlTime.getTime()) / 1000;
            const remainingTimeInSeconds = Math.max(0, 4 * 3600 - timeElapsedInSeconds);

            setIsCameraAndGalleryEnabled(remainingTimeInSeconds === 0);
            setRemainingTime(remainingTimeInSeconds);

            if (remainingTimeInSeconds > 0) {
                startCountdown(remainingTimeInSeconds);
            }
        } catch (error) {
            console.error("Error al verificar el último control:", error);
            setIsCameraAndGalleryEnabled(true);
            setRemainingTime(0);
        }
    }, [id]);

    useEffect(() => {
        checkLastControlTime(); // Llamamos a la función al cargar el componente
    }, [checkLastControlTime]);

    // Función para actualizar la cuenta regresiva
    const startCountdown = (timeInSeconds: number) => {
        let timer = timeInSeconds;

        const interval = setInterval(() => {
            timer--;
            setRemainingTime(timer);

            if (timer <= 0) {
                clearInterval(interval); // Detener el contador cuando llegue a 0
                setIsCameraAndGalleryEnabled(true); // Habilitar los botones cuando ya no falten minutos
            }
        }, 1000); // Actualizar cada segundo
    };

    // Convertir el tiempo restante en horas y minutos
    const formatRemainingTime = (timeInSeconds: number) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor(timeInSeconds % 60); // Obtener los segundos restantes
        return `${hours}h ${minutes}m ${seconds}s`; // Formato de horas, minutos y segundos
    };

    const handleValidateConjuntiva = async (imageUri: string) => {
        setLoading(true);
        try {
            const result = await validateConjuntiva(imageUri);
            if (result === false) {
                showToast("error", "No es una imagen válida"); // Mostrar Toast de error
                setIsImageValid(false); // La imagen no es válida
                return false;
            }
            setIsImageValid(true); // La imagen es válida
            return true;
        } catch (error) {
            showToast("error", (error as Error).message); // Mostrar el mensaje de error del servidor
            setIsImageValid(false); // La imagen no es válida
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelected = async (uri: string) => {
        setSelectedImage(uri); // Guardar la imagen seleccionada
        const isValid = await handleValidateConjuntiva(uri); // Validar la imagen
        if (!isValid) {
            setSelectedImage(null); // Limpiar la imagen si no es válida
        }
    };

    const captureCombinedImage = async () => {
        if (!selectedImage) {
            showToast("error", "Selecciona una imagen primero");
            return;
        }
        setLoading(true);
        try {
            if (!imageContainerRef.current) {
                throw new Error("El contenedor de la imagen no está disponible.");
            }
            const result = await recortarImagen(imageContainerRef);
            console.log("Resultado del recorte:", result.error);
            if (result.error) throw new Error(result.error);
            setCroppedImage(`data:image/png;base64,${result.cropped_image}`);
            setRespuesta(result.result);
            setMesagge(result.message);
            setModalVisible(true); // Muestra el modal después de recortar la imagen
        } catch {
            showToast("error", "Error al procesar la imagen"); // Mostrar Toast de error
        } finally {
            setLoading(false);
        }
    };

    return (
        <GestureHandlerRootView style={homeStyles.screen}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "NUEVA CONSULTA",
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
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#AAAAAA" />
                        </TouchableOpacity>
                    ),
                }}
            />

            {!recomendacionAceptada ? (
                <RecommendationOverlay onAccept={() => setRecomendacionAceptada(true)} />

            ) : (
                <SafeAreaView style={{ flex: 1 }}>
                    {remainingTime > 0 && (
                        <View style={predictionStyles.remainingTimeContainer}>
                            <Text style={predictionStyles.remainingTimeText}>
                                Tiempo restante para la siguiente consulta:
                            </Text>
                            <Text style={predictionStyles.remainingTimeValue}>
                                {formatRemainingTime(remainingTime)}
                            </Text>
                        </View>
                    )}

                    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                        <ImagePickerButton
                            type="camera"
                            onImageSelected={handleImageSelected} // Usar la nueva función
                            disabled={!isCameraAndGalleryEnabled} // Deshabilitar el botón si el control fue reciente
                        />
                        <ImagePickerButton
                            type="gallery"
                            onImageSelected={handleImageSelected} // Usar la nueva función
                            disabled={!isCameraAndGalleryEnabled} // Deshabilitar el botón si el control fue reciente
                        />
                    </View>

                    {selectedImage && isImageValid ? (
                        <>
                            <ImagePreviewWithRecommendations
                                selectedImage={selectedImage}
                                silhouetteImage={silhouetteImage}
                                ref={imageContainerRef}
                                onPress={captureCombinedImage}
                            />
                           
                        </>
                    ) : (
                        !loading && selectedImage && (
                            <Text style={predictionStyles.errorText}>La imagen no es válida</Text>
                        )
                    )}

                   
                    {loading && (
                        <View style={predictionStyles.loadingContainer}>
                            <ActivityIndicator size="large" color="#FFF" />
                        </View>
                    )}

                    <ImgrecortadaModal
                        visible={modalVisible}
                        title="Imagen Recortada"
                        onClose={() => setModalVisible(false)}
                        imgrecortada={croppedImage || ""}
                        imagenoriginal={selectedImage || ""}
                        ultimoControl={ultimoControlData}
                        mesagge={mesagge}
                        respuesta={respuesta}
                    />
                </SafeAreaView>
            )}
            <Toast />
        </GestureHandlerRootView>
    );
};

export default Prediction;
