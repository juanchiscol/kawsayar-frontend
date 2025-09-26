

import { StyleSheet } from "react-native";


export const perfilStyles = StyleSheet.create({
    profileImageContainer: {
        width: 70, // Aumento en el tamaño de la imagen
        height: 70, // Aumento en la altura de la imagen
        borderRadius: "100%", // Sigue siendo redondeada
        overflow: "hidden",
    },
    profileImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    siguienteControl: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#3C4A59", // Gris con un toque de azul
        padding: 12,
        borderRadius: 12,
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    panel: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#AAAA", // Gris con un toque de azul
        padding: 12,
        borderRadius: 12,
        shadowColor: "rgba(255, 255, 255, 0.2)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalContainer: {
        width: "80%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
      },
      modalMessage: {
        fontSize: 16,
        color: "#555",
        marginBottom: 20,
        textAlign: "center",
      },
      modalButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
      },

});