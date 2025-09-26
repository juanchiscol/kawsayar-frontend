import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Image
} from "react-native";
import Button from "@/components/Button";

type RecommendationOverlayProps = {
    onAccept: () => void;
};

const RecommendationOverlay: React.FC<RecommendationOverlayProps> = ({ onAccept }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, translateY]);

    return (
        <Animated.View
            style={[
                styles.overlay,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY }],
                },
            ]}
        >
            <Image
                source={require("@/assets/images/doctora.png")}
                style={styles.arrowImage}
            />

            <Text style={styles.title}>Recomendaciones importantes</Text>

            <View style={styles.tipBox}>
                <Text style={styles.tipEmoji}>📷</Text>
                <Text style={styles.tipText}>
                    Las imágenes de <Text style={styles.bold}>mala calidad</Text> o tomadas <Text style={styles.bold}>incorrectamente</Text> pueden generar resultados imprecisos.
                </Text>
            </View>

            <View style={styles.tipBox}>
                <Text style={styles.tipEmoji}>🚫⚡</Text>
                <Text style={styles.tipText}>
                    Evite usar <Text style={styles.bold}>flash</Text> al tomar la foto, ya que puede alterar los colores reales.
                </Text>
            </View>


            <View style={styles.tipBox}>
                <Text style={styles.tipEmoji}>🔍</Text>
                <Text style={styles.tipText}>
                    Mantenga la cámara <Text style={styles.bold}>cerca de la zona a evaluar</Text>, sin alejarse demasiado.
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title="Aceptar"
                    onPress={onAccept}
                    backgroundColor="rgb(72, 187, 171)"
                    textColor="#000000"
                />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(47, 58, 74, 0.95)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
        zIndex: 1000,
    },
    arrowImage: {
        width: 180,
        height: 180,
        resizeMode: "contain",
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        color: "#fff",
        fontFamily: "ArvoBold",
        marginBottom: 20,
        textAlign: "center",
    },
    tipBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 15,
        width: "100%",
    },
    tipEmoji: {
        fontSize: 24,
        marginRight: 10,
    },
    tipText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "ArvoRegular",
        flex: 1,
        textAlign: "justify",
    },
    bold: {
        fontFamily: "ArvoBold",
    },
    buttonContainer: {
        marginTop: 30,
        width: "100%",
        alignItems: "center",
    },
});

export default RecommendationOverlay;
