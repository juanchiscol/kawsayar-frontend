import { StyleSheet } from "react-native";

export const profilesStyles = StyleSheet.create({

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 30,
    fontFamily: "ArvoBold",
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  username: {
    fontSize: 25,
    color: "#AAAAAA",
    fontFamily: "ArvoBold",
    marginTop: 10,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  profileCard: {
    alignItems: "center",
    width: 140, // Tamaño aumentado para la tarjeta
    height: 160, // Altura también aumentada para el perfil
    justifyContent: "center", // Asegura que el contenido dentro de la tarjeta esté centrado
    backgroundColor: "#292b3e",
    borderRadius: 16,
    margin: 10,
    padding: 10,
  },
  profileImageContainer: {
    width: 100, // Aumento en el tamaño de la imagen
    height: 100, // Aumento en la altura de la imagen
    borderRadius: 60, // Sigue siendo redondeada
    overflow: "hidden",
    marginBottom: 10,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profileName: {
    fontSize: 18, // Aumento del tamaño de la fuente
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "ArvoBold",
  },
  logoutContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1, // Asegúrate de que se sobreponga al resto del contenido
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  noProfilesText: {
    fontSize: 25,
    fontFamily: "ArvoBold",
    fontWeight: "bold",
    color: "#AAAA",
  },
});
