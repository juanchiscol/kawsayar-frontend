import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { MaterialIcons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

interface AnemiaChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
}

type ViewMode = "months" | "days" | "controls";

const AnemiaChart: React.FC<AnemiaChartProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("months");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  const processData = () => {
    const monthlyData: Record<string, any> = {};

    data.labels.forEach((dateTimeString, index) => {
      const [datePart, timePart] = dateTimeString.split(" ");
      const [day, month, year] = datePart.split("/").map(Number);
      const date = new Date(year, month - 1, day);

      const monthKey = `${month}/${year}`;
      const monthName = date.toLocaleString("es-ES", { month: "long" });
      const dayKey = datePart;
      const dayLabel = `${day}/${month}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          average: 0,
          count: 0,
          monthName,
          days: {},
        };
      }

      if (!monthlyData[monthKey].days[dayKey]) {
        monthlyData[monthKey].days[dayKey] = {
          date: dayKey,
          dayLabel,
          controls: [],
          controlTimes: [],
          average: 0,
        };
      }

      monthlyData[monthKey].days[dayKey].controls.push(data.datasets[0].data[index]);
      monthlyData[monthKey].days[dayKey].controlTimes.push(timePart);

      const dayControls = monthlyData[monthKey].days[dayKey].controls;
      monthlyData[monthKey].days[dayKey].average =
        dayControls.reduce((a: number, b: number) => a + b, 0) /
        dayControls.length;

      const allMonthControls = Object.values(monthlyData[monthKey].days).flatMap((day: any) => day.controls);
      monthlyData[monthKey].average =
        allMonthControls.reduce((a: number, b: number) => a + b, 0) /
        allMonthControls.length;
      monthlyData[monthKey].count = allMonthControls.length;
    });

    return monthlyData;
  };

  const monthlyData = processData();
  const months = Object.keys(monthlyData).sort((a, b) => {
    const [aMonth, aYear] = a.split("/").map(Number);
    const [bMonth, bYear] = b.split("/").map(Number);
    return aYear === bYear ? aMonth - bMonth : aYear - bYear;
  });

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 1,
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "rgba(79, 158, 148, 1)",
      fill: "white",
    },
    propsForBackgroundLines: {
      strokeDasharray: "0",
      stroke: "#E5E7EB",
    },
    fillShadowGradient: "#4F46E5",
    fillShadowGradientOpacity: 0.1,
  };

  const animateViewChange = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      callback();
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const getTitle = () => {
    switch (viewMode) {
      case "months":
        return "Resumen mensual";
      case "days":
        return selectedMonth ? `Controles de ${monthlyData[selectedMonth].monthName}` : "";
      case "controls":
        return selectedDay ? `Controles del ${selectedDay}` : "";
      default:
        return "";
    }
  };

  const renderChart = () => {
    let labels: string[] = [];
    let dataPoints: number[] = [];

    if (viewMode === "months") {
      labels = months.map((m) => monthlyData[m].monthName);
      dataPoints = months.map((m) => monthlyData[m].average);
    } else if (viewMode === "days" && selectedMonth) {
      const days = Object.values(monthlyData[selectedMonth].days);
      labels = days.map((d: any) => d.dayLabel);
      dataPoints = days.map((d: any) => d.average);
    } else if (viewMode === "controls" && selectedMonth && selectedDay) {
      const controls = monthlyData[selectedMonth].days[selectedDay].controls;
      const times = monthlyData[selectedMonth].days[selectedDay].controlTimes.map((time: string) => {
        const [hour, minute] = time.split(":").map(Number);
        const period = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12; // Convert to 12-hour format
        return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
      });

      labels = times;
      dataPoints = controls;
    }

    return (
      <LineChart
        data={{ labels, datasets: [{ data: dataPoints }] }}
        width={screenWidth - 32}
        height={250}
        chartConfig={chartConfig}
        bezier
        style={{ borderRadius: 16 }}
      />
    );
  };
  const renderList = () => {
    let items: any[] = [];

    if (viewMode === "months") {
      items = months.map((month) => ({
        title: monthlyData[month].monthName,
        subtitle: `Promedio: ${monthlyData[month].average.toFixed(1)}\nMínimo: ${Math.min(...Object.values(monthlyData[month].days).flatMap((day: any) => day.controls)).toFixed(1)}\nMáximo: ${Math.max(...Object.values(monthlyData[month].days).flatMap((day: any) => day.controls)).toFixed(1)}\nNúmero de controles: ${monthlyData[month].count}`,
        onPress: () => animateViewChange(() => {
          setSelectedMonth(month);
          setViewMode("days");
        }),
      }));
    } else if (viewMode === "days" && selectedMonth) {
      const days = Object.values(monthlyData[selectedMonth].days);
      items = days.map((day: any) => ({
        title: `Fecha: ${day.dayLabel}`,
        subtitle: `Promedio: ${day.average.toFixed(1)}\nMáximo: ${Math.max(...day.controls).toFixed(1)}\nMínimo: ${Math.min(...day.controls).toFixed(1)}\nNúmero de controles: ${day.controls.length}`,
        onPress: () => animateViewChange(() => {
          setSelectedDay(day.date);
          setViewMode("controls");
        }),
      }));
    }

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.listScroll}>
        {items.map((item, index) => (
          <TouchableOpacity key={index} onPress={item.onPress} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title.toUpperCase()}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
    
  };

  const renderBackButton = () => {
    if (viewMode === "months") return null;
    const backLabel = viewMode === "controls" ? "Días" : "Meses";
    return (
      <TouchableOpacity
        onPress={() => animateViewChange(() => {
          if (viewMode === "controls") {
            setViewMode("days");
            setSelectedDay(null);
          } else {
            setViewMode("months");
            setSelectedMonth(null);
          }
        })}
        style={styles.backButton}
      >
        <Animated.View style={styles.backContertainer}>
          <MaterialIcons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backText}>{backLabel}</Text>

        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.title}>{getTitle()}</Text>
        <View style={styles.chartBox}>{renderChart()}</View>
        {renderBackButton()}
        {viewMode !== "controls" && renderList()}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: "#fff",
    backgroundColor: "rgb(66, 125, 117)",
    padding: 12,
    borderRadius: 20,
  },
  chartBox: {
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 16,
  },
  listScroll: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#2D3748", // tono más oscuro con profundidad
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 16,
    minWidth: 160,
    maxWidth: 240,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#72C5B6", // Verde pastel bonito
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontFamily: "ArvoBold",
  },
  
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: "#E2E8F0", // gris claro, mejor contraste
    fontFamily: "ArvoRegular",
  },
  
  backContertainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(66, 125, 117)",
    padding: 10,
    borderRadius: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 6,
    fontWeight: "bold",
    backgroundColor: "rgb(66, 125, 117)",
  },
});

export default AnemiaChart;
