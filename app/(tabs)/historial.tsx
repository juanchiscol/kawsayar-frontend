import { fetchControlesPorPerfil } from "@/apis/apis";
import { useProfile } from "@/app/AppContext";
import ExportToPDF from "@/components/ExportToPDF";
import { globalStyles } from "@/styles/global-styles";
import { historialStyles } from "@/styles/historial-styles";
import { homeStyles } from "@/styles/home-styles";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import moment from "moment";
import "moment/locale/es";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Animated, Easing, ScrollView, Text, TouchableOpacity, View } from "react-native";

const Historial = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const { profile } = useProfile();
  const { id, nombres, apellido_paterno, apellido_materno, dni, edad, fecha_nacimiento, sexo } = profile ?? {};
  const router = useRouter();

  const [controles, setControles] = useState([]);
  const [expandedMonths, setExpandedMonths] = useState<{ [key: string]: boolean }>({});
  const [animations] = useState<{ [key: string]: Animated.Value }>({});
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "up" | "down">("all");

  useFocusEffect(
    useCallback(() => {
      if (id) {
        setLoading(true);  // Activar loading
        fetchControlesPorPerfil(id)
          .then((controles) => {
            setControles(controles);
            setLoading(false);  // Desactivar loading cuando los datos están listos
          })
          .catch((error) => {
            console.error("Error fetching controles:", error);
            setLoading(false);  // Desactivar loading en caso de error
          });
      }
    }, [id])
  );

  const toggleMonth = (month: string) => {
    setExpandedMonths((prev) => {
      const newState = { ...prev, [month]: !prev[month] };
      if (!animations[month]) animations[month] = new Animated.Value(0);
      Animated.timing(animations[month], {
        toValue: newState[month] ? 1 : 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
      return newState;
    });
  };

  const formatDate = (date: Date) => moment(date).format("DD [de] MMMM YYYY");
  const formatTime = (date: Date) => moment(date).format("hh:mm A");  // Formato 12 horas con AM/PM

  const filteredControles = useMemo(
    () =>
      controles.filter((control: any) => {
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "up" && control.mejoro) ||
          (statusFilter === "down" && (control.mejoro === false || control.mejoro === null));

        const yearLabel = moment(control.fecha_creacion).format("YYYY");
        const matchesYear = selectedYear === "all" || yearLabel === selectedYear;

        return matchesStatus && matchesYear;
      }),
    [controles, selectedYear, statusFilter]
  );

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(controles.map((c: any) => moment(c.fecha_creacion).format("YYYY"))));
    return years.sort((a, b) => Number(b) - Number(a));
  }, [controles]);

  const groupedByMonth = filteredControles.reduce((acc: { [key: string]: any[] }, control: { fecha_creacion: string; id: number; mejoro: boolean | null }) => {
    const month = moment(control.fecha_creacion).format("MMM, YYYY");
    if (!acc[month]) acc[month] = [];
    acc[month].push(control);
    return acc;
  }, {});

  // Ordenar los meses de más reciente a más antiguo
  const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => moment(b, "MMM, YYYY").diff(moment(a, "MMM, YYYY")));

  // Ordenar los controles dentro de cada mes de lo más reciente a lo más antiguo
  Object.keys(groupedByMonth).forEach((month) => {
    groupedByMonth[month].sort((a, b) => moment(b.fecha_creacion).diff(moment(a.fecha_creacion)));
  });

  if (loading) {
    return (
      <View style={[homeStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <View style={homeStyles.screen}>
      <Stack.Screen
        options={{
          title: "Historial",
          headerShown: false,
        }}
      />
      <View style={globalStyles.headerContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome5 name="history" size={24} color="#AAAAAA" />
          <Text style={[globalStyles.titleapp, { marginLeft: 10 }]}>Historial</Text>
        </View>
      </View>
      <ExportToPDF
        nombres={nombres ?? ""}
        apellido_paterno={apellido_paterno ?? ""}
        apellido_materno={apellido_materno ?? ""}
        dni={dni ?? ""}
        edad={edad ?? ""}
        fecha_nacimiento={fecha_nacimiento ?? ""}
        sexo={sexo ?? ""}
        controles={controles}
        isLoading={loading}
      />

      <View style={[historialStyles.filtersWrapper, historialStyles.filtersCard]}>
        <View style={historialStyles.filterHeader}>
          <View style={historialStyles.filterTitleRow}>
            <Ionicons name="calendar" size={18} color="#9AA5B1" />
            <Text style={historialStyles.filterTitle}>Filtrar por año</Text>
          </View>
          <TouchableOpacity onPress={() => {
            setSelectedYear("all");
            setStatusFilter("all");
          }}>
            <Text style={historialStyles.resetFilter}>Limpiar</Text>
          </TouchableOpacity>
        </View>

        <Text style={historialStyles.filterSubtitle}>Selecciona un año y estado para acotar los controles.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={historialStyles.monthStrip}>
          <TouchableOpacity
            style={[historialStyles.monthChip, selectedYear === "all" && historialStyles.monthChipActive]}
            onPress={() => setSelectedYear("all")}
          >
            <Text style={[historialStyles.monthChipText, selectedYear === "all" && historialStyles.monthChipTextActive]}>Todos</Text>
          </TouchableOpacity>

          {availableYears.map((year) => {
            const active = selectedYear === year;
            return (
              <TouchableOpacity
                key={year}
                style={[historialStyles.monthChip, active && historialStyles.monthChipActive]}
                onPress={() => setSelectedYear(year)}
              >
                <Text style={[historialStyles.monthChipText, active && historialStyles.monthChipTextActive]}>{year}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={historialStyles.filterChips}>
          {[
            { key: "all", label: "Estado", icon: "options-outline" },
            { key: "up", label: "Mejoró", icon: "trending-up" },
            { key: "down", label: "Empeoró", icon: "trending-down" },
          ].map((chip) => {
            const active = statusFilter === chip.key;
            return (
              <TouchableOpacity
                key={chip.key}
                style={[historialStyles.chip, active && historialStyles.chipActive]}
                onPress={() => setStatusFilter(chip.key as any)}
              >
                <View style={historialStyles.chipContent}>
                  <Ionicons
                    name={chip.icon as any}
                    size={14}
                    color={active ? "#FFF" : "#9AA5B1"}
                  />
                  <Text style={[historialStyles.chipText, active && historialStyles.chipTextActive]}>{chip.label}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        style={historialStyles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
      >
        {filteredControles.length === 0 && (
          <View style={historialStyles.emptyState}>
            <Ionicons name="folder-open" size={26} color="#9AA5B1" />
            <Text style={historialStyles.emptyTitle}>Sin resultados</Text>
            <Text style={historialStyles.emptySubtitle}>Ajusta los filtros para ver controles.</Text>
          </View>
        )}
        {sortedMonths.map((month) => (
          <View key={month}>
            <TouchableOpacity style={historialStyles.monthHeader} onPress={() => toggleMonth(month)}>
              <Text style={historialStyles.monthText}>{month.toUpperCase()}</Text>
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: animations[month]?.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "180deg"],
                      }) || "0deg",
                    },
                  ],
                }}
              >
                <Ionicons name={expandedMonths[month] ? "chevron-up" : "chevron-down"} size={20} color="#fff" />
              </Animated.View>
            </TouchableOpacity>
            {expandedMonths[month] && (
              <Animated.View
                style={{
                  opacity: animations[month] || 0,
                  transform: [
                    {
                      translateY: animations[month]?.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-10, 0],
                      }) || 0,
                    },
                  ],
                }}
              >
                {groupedByMonth[month].map((control) => {
                  const isUp = control.mejoro === true;
                  const isDown = control.mejoro === false;
                  const statusLabel = isUp ? "Mejoró" : isDown ? "Empeoró" : "Sin dato";

                  return (
                    <View key={control.id} style={historialStyles.card}>
                      <View style={historialStyles.cardLeft}>
                        <View style={historialStyles.badgeRow}>
                          <View
                            style={[
                              historialStyles.statusPill,
                              isUp && historialStyles.statusUp,
                              isDown && historialStyles.statusDown,
                              !isUp && !isDown && historialStyles.statusNeutral,
                            ]}
                          >
                            <Ionicons
                              name={isUp ? "trending-up" : isDown ? "trending-down" : "remove"}
                              size={14}
                              color={isUp ? "#0E9F6E" : isDown ? "#E02424" : "#6B7280"}
                            />
                            <Text
                              style={[
                                historialStyles.statusText,
                                isUp && historialStyles.statusTextUp,
                                isDown && historialStyles.statusTextDown,
                                !isUp && !isDown && historialStyles.statusTextNeutral,
                              ]}
                            >
                              {statusLabel}
                            </Text>
                          </View>
                        </View>
                        <Text style={historialStyles.date}>{formatDate(control.fecha_creacion)}</Text>
                        <Text style={historialStyles.time}>{formatTime(control.fecha_creacion)}</Text>
                      </View>
                      <View style={historialStyles.actions}>
                        <TouchableOpacity
                          style={historialStyles.detailButtonContainer}
                          onPress={() => router.push(`/detalle?id=${control.id}&perfilId=${id}`)}
                        >
                          <Text style={historialStyles.detailButton}>Ver detalle</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </Animated.View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Historial;
