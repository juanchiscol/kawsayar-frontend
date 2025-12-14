import { StyleSheet } from "react-native";

export const historialStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  filtersWrapper: {
    gap: 12,
    marginBottom: 14,
  },

  filtersCard: {
    backgroundColor: "#2934496c",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    marginTop: 15,
  },

  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  filterTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  filterTitle: {
    color: "#E5E7EB",
    fontFamily: "ArvoRegular",
    fontWeight: "700",
    fontSize: 14,
  },

  filterSubtitle: {
    color: "#9AA5B1",
    fontFamily: "ArvoRegular",
    fontWeight: "500",
    fontSize: 12,
    marginTop: 6,
  },

  resetFilter: {
    color: "#9AA5B1",
    fontFamily: "ArvoRegular",
    fontWeight: "600",
    fontSize: 13,
  },

  filterChips: {
    flexDirection: "row",
    gap: 10,
  },

  monthStrip: {
    marginTop: 8,
    marginBottom: 6,
  },

  monthChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#2E3A4A",
    marginRight: 10,
  },

  monthChipActive: {
    backgroundColor: "rgba(118, 224, 210, 0.53)",
    borderColor: "rgba(118, 224, 210, 0.53)",
  },

  monthChipText: {
    color: "#E5E7EB",
    fontFamily: "ArvoRegular",
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  monthChipTextActive: {
    color: "#FFF",
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#2E3A4A",
  },

  chipActive: {
    backgroundColor: "rgba(118, 224, 210, 0.53)",
    borderColor: "rgba(118, 224, 210, 0.53)",
  },

  chipText: {
    color: "#9AA5B1",
    fontFamily: "ArvoRegular",
    fontWeight: "600",
  },

  chipTextActive: {
    color: "#FFF",
  },

  chipContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
    backgroundColor: "#233042ff",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#1F2937",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
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
    padding: 16,
    marginBottom: 14,
    backgroundColor: "#1b223198",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },

  cardLeft: {
    flex: 1,
    gap: 6,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
  },

  statusUp: {
    backgroundColor: "rgba(14, 159, 110, 0.12)",
    borderColor: "rgba(14, 159, 110, 0.35)",
  },

  statusDown: {
    backgroundColor: "rgba(224, 36, 36, 0.12)",
    borderColor: "rgba(224, 36, 36, 0.35)",
  },

  statusNeutral: {
    backgroundColor: "rgba(107, 114, 128, 0.12)",
    borderColor: "rgba(107, 114, 128, 0.35)",
  },

  date: {
    fontSize: 16,
    color: "#E5E7EB",
    fontWeight: "500",
    fontFamily: "ArvoRegular",
  },

  time: {
    fontSize: 13,
    color: "#9AA5B1",
    fontFamily: "ArvoRegular",
    fontWeight: "400",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  detailButtonContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#rgba(118, 224, 210, 0.53)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  detailButton: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "ArvoRegular",
  },

  statusText: {
    fontSize: 13,
    fontFamily: "ArvoRegular",
    fontWeight: "700",
  },

  statusTextUp: {
    color: "#0E9F6E",
  },

  statusTextDown: {
    color: "#E02424",
  },

  statusTextNeutral: {
    color: "#9AA5B1",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    gap: 8,
  },

  emptyTitle: {
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "ArvoRegular",
  },

  emptySubtitle: {
    color: "#9AA5B1",
    fontSize: 14,
    fontFamily: "ArvoRegular",
    textAlign: "center",
  },
});
