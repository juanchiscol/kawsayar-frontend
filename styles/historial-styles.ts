import { StyleSheet } from "react-native";

export const historialStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  pdfButton: {
    backgroundColor: "rgb(52, 118, 109)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  
  pdfButtonText: {
    color: "#FFF",
    fontFamily: "ArvoRegular",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },

  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#3C4A59",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginVertical: 10,
  },

  monthText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "ArvoRegular",
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 14,
    backgroundColor: "rgb(239, 240, 240)",
    borderRadius: 15,
  },

  date: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    fontFamily: "ArvoRegular",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  detailButtonContainer: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#3C4A59",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },

  detailButton: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "ArvoRegular",
  },

  // Mejorar la legibilidad de las fechas y agregar la hora
  time: {
    fontSize: 12,
    color: "#7D7D7D", // Color más suave para la hora
    fontFamily: "ArvoRegular",
    fontWeight: "400",
  },
});
