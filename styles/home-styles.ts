import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1E1E2C",
    paddingHorizontal: 16,
  },

  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    marginTop: 10,
    backgroundColor: "#262D3A",
    borderRadius: 12,
  },

  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60, // En lugar de "100%" para evitar error
    overflow: "hidden",
    backgroundColor: "#72C5B6",
  },

  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  subTile: {
    fontSize: 17,
    color: "#fff",
    textAlign: "left",
    fontWeight: "500",
    fontFamily: "ArvoRegular",
  },
  subTileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 20,
  },
  nombretitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
    fontFamily: "ArvoBold",
  },

  siguienteControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: "#2F3A4A",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontFamily: "ArvoRegular",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    fontFamily: "ArvoRegular",
    color: "#fff",
    opacity: 0.8,
  },
  buttonContainer: {
    marginLeft: 10,
  },
  button: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#72C5B6",
    justifyContent: "center",
    alignItems: "center",
  },

  bodyContainer: {
    flex: 1,
    backgroundColor: "#1E1E2C", // Fondo de la pantalla principal
    paddingHorizontal: 16, // Espacio a los lados
    paddingTop: 20, // Espacio superior
    paddingBottom: 10, // Espacio inferior
  },
  scrollView: {
    flexGrow: 1, // Asegura que el contenido crezca correctamente
    paddingBottom: 20, // Espacio adicional al final para evitar que los elementos queden pegados
  },
  sectionTitle: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "ArvoBold",
    marginBottom: 10,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "ArvoRegular",
    marginBottom: 10,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitleText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "ArvoBold",
  },
  sectionTitleButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitleButtonText: {
    fontSize: 16,
    color: "#72C5B6",
    fontFamily: "ArvoRegular",
  },
  sectionTitleButtonIcon: {
    marginLeft: 5,
  },
  titleSection: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "ArvoBold",
    marginBottom: 10,
  },
  titleExtra: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.5)",
    fontFamily: "ArvoBold",
    textAlign: "center",
    alignItems: "center",
  },
});
