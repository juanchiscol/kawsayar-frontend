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
    const translateY = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, translateY, scaleAnim]);

    return (
        <Animated.View
            style={[
                styles.overlay,
                {
                    opacity: fadeAnim,
                    transform: [
                        { translateY },
                        { scale: scaleAnim }
                    ],
                },
            ]}
        >
            <View style={styles.container}>
                <View style={styles.headerCard}>
                    <Image
                        source={require("@/assets/images/doctora.png")}
                        style={styles.arrowImage}
                    />
                    <Text style={styles.title}>Consejos para capturar</Text>
                    <Text style={styles.subtitle}>la mejor foto</Text>
                </View>

                <View style={styles.tipsContainer}>
                    <View style={styles.tipCard}>
                        <View style={[styles.tipIconBg, { backgroundColor: "rgba(255, 193, 7, 0.2)" }]}>
                            <Text style={styles.tipEmoji}>📷</Text>
                        </View>
                        <View style={styles.tipTextContainer}>
                            <Text style={styles.tipTitle}>Imagen Clara</Text>
                            <Text style={styles.tipText}>
                                Asegúrate de buena iluminación
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tipCard}>
                        <View style={[styles.tipIconBg, { backgroundColor: "rgba(244, 67, 54, 0.2)" }]}>
                            <Text style={styles.tipEmoji}>🚫</Text>
                        </View>
                        <View style={styles.tipTextContainer}>
                            <Text style={styles.tipTitle}>Sin Flash</Text>
                            <Text style={styles.tipText}>
                                Evita usar flash directo
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tipCard}>
                        <View style={[styles.tipIconBg, { backgroundColor: "rgba(76, 175, 80, 0.2)" }]}>
                            <Text style={styles.tipEmoji}>📏</Text>
                        </View>
                        <View style={styles.tipTextContainer}>
                            <Text style={styles.tipTitle}>Distancia Ideal</Text>
                            <Text style={styles.tipText}>
                                Acerca la cámara lo suficiente
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Continuar"
                        onPress={onAccept}
                        backgroundColor="rgba(118, 224, 210, 0.53)"
                        textColor="rgba(252, 252, 252, 1)"
                    />
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingHorizontal: 0,
        zIndex: 1000,
    },
    container: {
        width: "100%",
        backgroundColor: "rgba(47, 58, 74, 0.98)",

        paddingHorizontal: 24,
        paddingVertical: 32,
        paddingBottom: 40,
        alignItems: "center",
        height: "100%",
    },
    headerCard: {
        alignItems: "center",
        marginBottom: 28,
    },
    arrowImage: {
        width: 120,
        height: 120,
        resizeMode: "contain",
        marginBottom: 16,
    },
    title: {
        fontSize: 26,
        color: "#fff",
        fontFamily: "ArvoBold",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 26,
        color: "rgba(118, 224, 210, 1)",
        fontFamily: "ArvoBold",
        textAlign: "center",
    },
    tipsContainer: {
        width: "100%",
        marginBottom: 28,
        gap: 12,
    },
    tipCard: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    tipIconBg: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    tipEmoji: {
        fontSize: 24,
    },
    tipTextContainer: {
        flex: 1,
    },
    tipTitle: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "ArvoBold",
        marginBottom: 4,
    },
    tipText: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 13,
        fontFamily: "ArvoRegular",
        lineHeight: 18,
    },
    bold: {
        fontFamily: "ArvoBold",
        color: "#fff",
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
    },
});

export default RecommendationOverlay;
