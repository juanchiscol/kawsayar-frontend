import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import CustomModal from "./CustomModal";
import { homeStyles } from "@/styles/home-styles";
import { imageMapper } from "@/constants/imageMapper";

// Definimos el tipo Profile
interface Profile {
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    dni: string;
    ft_perfil: string;
    edad: string;
    fecha_nacimiento: string;
}

interface CustomModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    profiles: Profile[];
    userInfo: any; // Información del apoderado o padre
}

const formatearNombre = (
    nombre: string,
    apellido_paterno: string,
    apellido_materno: string
) => {
    const [primerNombre, ...otrosNombres] = nombre.split(" ");
    return `${primerNombre} ${otrosNombres
        .map((n) => `${n.charAt(0).toUpperCase()}.`)
        .join(" ")} ${apellido_paterno} ${apellido_materno.charAt(0).toUpperCase()}.`;
};

const ModalProfiles: React.FC<CustomModalProps> = ({
    visible,
    onClose,
    title,
    profiles,
    userInfo
}) => {
    return (
        <CustomModal visible={visible} onClose={onClose}>
            <View style={styles.modalContainer}>
                {/* Barra superior */}
                <View style={styles.modalHeader}>
                    <View style={styles.modalIndicator} />
                </View>

                <Text style={styles.modalTitle}>{title}</Text>

                {/* Información del apoderado o padre */}
                <View>
                    <Text style={[homeStyles.text, styles.sectionTitle]}>Datos del Apoderado o Padre:</Text>
                    <View style={styles.profileContainer}>
                        <View style={styles.profileTextContainer}>
                            <Text style={homeStyles.text}>{formatearNombre(userInfo.nombres, userInfo.apellido_paterno, userInfo.apellido_materno)}</Text>
                            <Text style={homeStyles.text}>DNI: {userInfo.dni}</Text>
                            <Text style={homeStyles.text}>Teléfono: {userInfo.celular}</Text>
                            <Text style={homeStyles.text}>Correo: {userInfo.email}</Text>
                            <Text style={homeStyles.text}>Edad: {userInfo.edad}</Text>
                        </View>
                    </View>
                </View>

                {/* Información del niño */}
                <View>
                    <Text style={[homeStyles.text, styles.sectionTitle]}>Datos del Niño:</Text>
                    <ScrollView>
                        {profiles.map((profile, index) => (
                            <View key={index} style={styles.profileContainer}>
                                <Image source={imageMapper[profile.ft_perfil] || imageMapper["default-profile.jpg"]} style={styles.profileImage} />
                                <View style={styles.profileTextContainer}>
                                    <Text style={homeStyles.text}>{formatearNombre(profile.nombres, profile.apellido_paterno, profile.apellido_materno)}</Text>
                                    <Text style={homeStyles.text}>DNI: {profile.dni}</Text>
                                    <Text style={homeStyles.text}>Fecha de nacimiento: {profile.fecha_nacimiento}</Text>
                                    <Text style={homeStyles.text}>Edad: {profile.edad}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        borderRadius: 15,
        shadowColor: "#000",
        shadowRadius: 8,
    },
    modalHeader: {
        alignItems: "center",
        marginBottom: 20,
    },
    modalIndicator: {
        width: 50,
        height: 5,
        backgroundColor: "#888",
        borderRadius: 10,
    },
    modalTitle: {
        color: "rgb(72, 187, 171)",
        fontSize: 20,
        fontFamily: "ArvoBold",
        marginBottom: 20,
        textAlign: "center",
    },

    sectionTitle: {
        fontWeight: "bold",
        color: "rgb(72, 187, 171)",
        fontSize: 16,
        marginBottom: 10,
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        padding: 10,
        borderRadius: 10,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    profileTextContainer: {
        flexDirection: "column",
        justifyContent: "center",
    },
});

export default ModalProfiles;
