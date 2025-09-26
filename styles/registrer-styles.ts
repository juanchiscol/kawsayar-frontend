import { StyleSheet } from "react-native";

export const registrerStyles = StyleSheet.create({
 

  title: {
    fontSize: 30,
    fontFamily: "ArvoBold",
    fontWeight: "bold",
    color: "#AAAAAA",
    textAlign: "left",
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    width: "100%",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: "rgb(72, 187, 171)",
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    color: "rgb(72, 187, 171)",
    fontWeight: "bold",
    fontFamily: "ArvoRegular",
  },

  scrollContainer: {
    flexGrow: 1,
    paddingTop: 20,
  },

  formContainer: {
    marginBottom: 0,
  },

  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 20, // Separa un poco más el botón de la parte inferior
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  termsText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "ArvoRegular",
  },
  termsLink: {
    color: "rgb(72, 187, 171)",
    fontFamily: "ArvoRegular",
    textDecorationLine: "underline",
  },
  
});
