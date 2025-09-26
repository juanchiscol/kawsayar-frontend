import { StyleSheet } from "react-native";

export const predictionStyles = StyleSheet.create({
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

    recommendationBox: {
        marginTop: 25,
        flexDirection: "row",
        backgroundColor: "#2F3A4A",
        padding: 15,
        borderRadius: 20,
        alignItems: "flex-start",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    recommendationEmoji: {
        fontSize: 26,
        marginRight: 10,
    },
    recommendationText: {
        flex: 1,
        fontSize: 16,
        color: "#fff",
        fontFamily: "ArvoRegular",
        textAlign: "left",
        lineHeight: 22,

    },
    bold: {
        fontFamily: "ArvoBold",
        color: "#ffffff",
    },
    highlight: {
        color: "#48BBAA",
        fontFamily: "ArvoBold",
    },
    silhouetteImage: {
        position: "absolute",
        width: 150,
        height: 150,
        resizeMode: "contain",
        top: 0,
        left: 0,
    },
    loadingContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 100,
    },
    errorText: {
        marginTop: 20,
        fontSize: 16,
        color: "red",
        textAlign: "center",
    },
    remainingTimeContainer: {
        marginVertical: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2F3A4A",
        paddingVertical: 10,
        borderRadius: 15, // Bordes redondeados

    },
    remainingTimeContainer2: {
        marginVertical: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2F3A4A",
        paddingVertical: 10,
        borderRadius: 15, // Bordes redondeados
        flex: 1, // Permitir que el contenedor ocupe el espacio disponible

    },
    remainingTimeText: {
        fontSize: 16,
        color: "#fff",
        fontFamily: "ArvoBold",
        marginBottom: 5,
        textAlign: "center",
    },
    remainingTimeValue: {
        fontSize: 24,  // Aumenté el tamaño para que destaque más
        color: "#fff",
        fontFamily: "ArvoBold",
        fontWeight: "bold", // Hacer que el texto resalte más
    },
    toggleButton: {

        backgroundColor: "#48BBAA",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,        

    },
    toggleButtonText: {
        fontSize: 16,
        fontFamily: "ArvoBold",
        color: "#000000",
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },
    closeTips: {
        fontSize: 18,
        color: "#fff",
        marginLeft: 10,
    },
    recommendationHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 10,
    },
    recommendationTitle: {
        fontSize: 18,
        fontFamily: "ArvoBold",
        color: "#fff",
    },
    tipItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    tipEmoji: {
        fontSize: 24,
        marginRight: 10,
    },
    tipText: {
        fontSize: 16,
        color: "#fff",
        fontFamily: "ArvoRegular",
        flex: 1,
    },
    tipTextBold: {
        fontFamily: "ArvoBold",
        color: "#ffffff",
    },
    tipTextHighlight: {
        color: "#48BBAA",
        fontFamily: "ArvoBold",
    },
    button: {
        backgroundColor: "#48BBAA",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: "ArvoBold",
        color: "#fff",
    },
    showTipsButton: {
        backgroundColor: "#48BBAA",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    showTipsText: {
        fontSize: 16,
        fontFamily: "ArvoBold",
        color: "#fff",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#2F3A4A",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
});