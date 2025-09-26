import React from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Button from "@/components/Button"; // Asegúrate de que tu componente Button esté disponible

interface ImagePickerButtonProps {
    type: "gallery" | "camera";
    onImageSelected: (uri: string) => void;
    disabled?: boolean; // Propiedad opcional para habilitar/deshabilitar el botón
}

const ImagePickerButton: React.FC<ImagePickerButtonProps> = ({ type, onImageSelected, disabled }) => {

    const pickImage = async () => {
        const permissionResult = type === "gallery"
            ? await ImagePicker.requestMediaLibraryPermissionsAsync()
            : await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert(`Se requiere permiso para acceder a la ${type === "gallery" ? "galería" : "cámara"}.`);
            return;
        }

        const result = await (type === "gallery"
            ? ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            })
            : ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            }));

        if (!result.canceled) {
            onImageSelected(result.assets[0].uri);
        }
    };

    return (
        <Button
            onPress={pickImage}
            title={`Abrir ${type === "gallery" ? "Galería" : "Cámara"}`}
            backgroundColor="#fff"
            textColor="#000"
            icon={type === "gallery" ? <FontAwesome5 name="images" size={20} color="dark" /> : <Ionicons name="camera" size={20} color="dark" />}
            style={{ flex: 1 }}
            disabled={disabled} // Deshabilitar el botón si es necesario
        />
    );
};

export default ImagePickerButton;
