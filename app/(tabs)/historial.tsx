import { fetchControlesPorPerfil } from "@/apis/apis";
import { useProfile } from "@/app/AppContext";
import ExportToPDF from "@/components/ExportToPDF";
import { globalStyles } from "@/styles/global-styles";
import { historialStyles } from "@/styles/historial-styles";
import { homeStyles } from "@/styles/home-styles";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import moment from "moment";
import "moment/locale/es";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Animated, Easing, ScrollView, Text, TouchableOpacity, View } from "react-native";

const Historial = () => {
  const { profile } = useProfile();
  const { id, nombres, apellido_paterno, apellido_materno, dni, edad, fecha_nacimiento, sexo } = profile ?? {};
  const router = useRouter();

  const [controles, setControles] = useState([]);
  const [expandedMonths, setExpandedMonths] = useState<{ [key: string]: boolean }>({});
  const [animations] = useState<{ [key: string]: Animated.Value }>({});
  const [loading, setLoading] = useState(true);

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

  const groupedByMonth = controles.reduce((acc: { [key: string]: any[] }, control: { fecha_creacion: string; id: number; mejoro: boolean | null }) => {
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
      <ScrollView style={historialStyles.container} showsVerticalScrollIndicator={false}>
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
                {groupedByMonth[month].map((control) => (
                  <View key={control.id} style={historialStyles.card}>
                    <View >
                      <Text style={historialStyles.date}>

                        {formatDate(control.fecha_creacion)}
                        {/* Fecha con formato "DD de MMMM YYYY" */}
                      </Text>
                      <Text style={historialStyles.date}>

                        {formatTime(control.fecha_creacion)} {/* Hora AM/PM */}
                      </Text>

                    </View>
                    <View style={historialStyles.actions}>
                      <Ionicons
                        name={control.mejoro === null || !control.mejoro ? "trending-down" : "trending-up"}
                        size={30}
                        color={control.mejoro ? "green" : "red"}
                      />
                      <TouchableOpacity
                        style={historialStyles.detailButtonContainer}
                        onPress={() => router.push(`/detalle?id=${control.id as any}&perfilId=${id}`)}
                      >
                        <Text style={historialStyles.detailButton}>Ver detalle</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </Animated.View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Historial;
