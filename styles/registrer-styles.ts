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
    paddingTop: 10,
  },

  formContainer: {
    marginBottom: 0,
    paddingHorizontal: 5,
  },

  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(72, 187, 171, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  verificationSection: {
    marginTop: 10,
    marginBottom: 15,
  },

  codeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
  },

  codeButton: {
    backgroundColor: "rgba(118, 224, 210, 0.53)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    width: "48%",
    marginTop: 0,
    marginBottom: 10,
  },

  codeButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(170, 170, 170, 0.3)",
  },

  codeButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "ArvoBold",
    fontWeight: "600",
  },

  codeButtonTextDisabled: {
    color: "rgba(170, 170, 170, 0.6)",
  },

  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 5,
  },

  registerButton: {
    width: "100%",
    backgroundColor: "rgb(72, 187, 171)",
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },

  registerButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(170, 170, 170, 0.3)",
  },

  registerButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "ArvoBold",
    fontWeight: "700",
  },

  registerButtonTextDisabled: {
    color: "rgba(170, 170, 170, 0.6)",
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
