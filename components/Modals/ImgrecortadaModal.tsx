import CustomModal from "./CustomModal";
import React, { useState } from "react";
import { Image, View, Text, Platform, ActivityIndicator } from "react-native";
import Button from "@/components/Button";
import { predictAnemia, insertarControl } from "@/apis/apis";
import { useRouter } from "expo-router"; // Importar useRouter
import { useProfile } from "@/app/AppContext";
import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from 'expo-image-manipulator';

interface ImgrecortadaModalProps {
    visible: boolean;
    onClose: () => void;
    imgrecortada: string;
    imagenoriginal: string;
    title: string;
    ultimoControl?: any; // Puedes definir un tipo más específico si lo deseas
    mesagge?: string;
    respuesta?: boolean;
}

const ImgrecortadaModal: React.FC<ImgrecortadaModalProps> = ({ visible, onClose, imgrecortada, imagenoriginal, title, ultimoControl, mesagge, respuesta}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [, setResult] = useState<string>("");
    const router = useRouter(); // Inicializar el router
    const { profile } = useProfile();
    const { id } = profile ?? {};

    // Convertir imagenoriginal a base64

    const handlePredictAnemia = async () => {
        if (!imgrecortada) {
            setResult("No hay imagen para procesar");
            return;
        }

        setLoading(true);

        try {
            const resizeImage = async (uri: string) => {
                const resizedImage = await ImageManipulator.manipulateAsync(
                    uri,
                    [{ resize: { width: 800 } }], // Ajusta el tamaño según sea necesario
                    { compress: 0.8 } // Comprime la imagen al 80%
                );
                return resizedImage.uri;
            };

            // Usar la función de redimensionado:
            const resizedUri = await resizeImage(imagenoriginal);
              const base64Image = await FileSystem.readAsStringAsync(resizedUri, {
                 encoding: FileSystem.EncodingType.Base64,
               });
            const base64ImageString = `data:image/jpg;base64,${base64Image}`;

            const predictionResult = await predictAnemia(imgrecortada);
            setResult(predictionResult);
            const data = {
                id_perfil: id,
                ruta_imagen_original: encodeURIComponent(base64ImageString),
                ruta_imagen_preprocesada: imgrecortada,
                tiene_anemia: predictionResult.result,
                probabilidad_anemia: parseFloat(predictionResult.prob_anemia.toFixed(2)),
                probabilidad_no_anemia: parseFloat(predictionResult.prob_no_anemia.toFixed(2)),
                fecha_control: new Date().toISOString().split("T")[0], // Solo la fecha
                mejoro: ultimoControl.probabilidad_anemia >= parseFloat(predictionResult.prob_anemia.toFixed(2)) ? 1 : 0, // Comparación de probabilidades
                id_recomendacion: predictionResult.id_recomendacion,
            };
            await insertarControl(data);

            // Cerrar el modal después de predecir
            onClose();

            // Redirigir a la página de resultado y pasar el resultado como un parámetro de la URL
            router.push(`/result?resultado=${encodeURIComponent(JSON.stringify(predictionResult))}&imgrecortada=${encodeURIComponent(imgrecortada)}&imagenoriginal=${encodeURIComponent(base64ImageString)}`);
        } catch (error) {
            setResult(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            {Platform.OS === 'ios' && (
                <CustomModal visible={visible} onClose={onClose}>
                    <View>
                        <View style={{ alignItems: "center", marginBottom: 10 }}>
                            <View style={{ width: 50, height: 5, backgroundColor: "#888", borderRadius: 10 }} />
                        </View>

                        <Text style={{ color: "rgb(72, 187, 171)", fontSize: 18, fontFamily: "ArvoBold", marginBottom: 20 }}>
                            {title}
                        </Text>


                        {respuesta === false ? (
                            <Text
                                style={{
                                    color: "rgb(189, 192, 191)",
                                    fontSize: 18,
                                    fontFamily: "ArvoBold",
                                    marginBottom: 20,
                                }}
                            >
                                {mesagge}
                            </Text>
                        ) : (
                            <>
                                <Image
                                    source={{ uri: imgrecortada }}
                                    style={{ width: "100%", height: 300, borderRadius: 20 }}
                                />
                                <Button
                                    onPress={() => handlePredictAnemia()}
                                    title="Predecir"
                                    backgroundColor="rgb(72, 187, 171)"
                                    textColor="#000000"
                                />
                            </>
                        )}

                        {loading && <ActivityIndicator size="large" color="#FFF" style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 100
                        }} />}
                    </View>
                </CustomModal>
            )}

            {Platform.OS === 'android' && (
                <CustomModal visible={visible} onClose={onClose}>
                    <View>
                        <View style={{ alignItems: "center", marginBottom: 10 }}>
                            <View style={{ width: 50, height: 5, backgroundColor: "#888", borderRadius: 10 }} />
                        </View>

                        <Text style={{ color: "rgb(72, 187, 171)", fontSize: 18, fontFamily: "ArvoBold", marginBottom: 20 }}>
                            {title}
                        </Text>
                        {mesagge === "La coloración no parece una conjuntiva." ? (
                            <Text
                                style={{
                                    color: "rgb(72, 187, 171)",
                                    fontSize: 14,
                                    fontFamily: "ArvoBold",
                                    marginBottom: 20,
                                }}
                            >
                                {mesagge}
                            </Text>
                        ) : (
                            <>
                                <Image
                                    source={{ uri: imgrecortada }}
                                    style={{ width: "100%", height: 300, borderRadius: 20 }}
                                />
                                <Button
                                    onPress={() => handlePredictAnemia()}
                                    title="Predecir"
                                    backgroundColor="rgb(72, 187, 171)"
                                    textColor="#000000"
                                />
                            </>
                        )}

                        {loading && <ActivityIndicator size="large" color="#FFF" style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 100
                        }} />}
                    </View>
                </CustomModal>
            )}

        </View>

    );
}

export default ImgrecortadaModal;
