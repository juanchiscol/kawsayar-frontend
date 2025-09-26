import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, Linking, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import { homeStyles } from "@/styles/home-styles";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const YOUTUBE_API_KEY = "AIzaSyDl8w5EVA_3KvoDLFs6T0NrLoyIMH9nZ40";
const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const fetchData = async (query: string, setData: React.Dispatch<React.SetStateAction<any[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  try {
    const response = await axios.get(YOUTUBE_BASE_URL, {
      params: {
        part: "snippet",
        q: query,
        key: YOUTUBE_API_KEY,
      },
    });

    const formattedData = response.data.items.map((item: any) => ({
      label: item.snippet?.title,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      image: item.snippet?.thumbnails?.high?.url,
    }));

    setData(formattedData);
    setError(null);
  } catch {
    setError("No se pudo cargar los datos.");
  }
};

interface VideoSectionProps {
  title: string;
  items: { label: string; link: string; image: string }[];
  error: string | null;
  iconName: string;
  iconColor: string;
  loading: boolean;
}

const VideoSection: React.FC<VideoSectionProps> = ({ title, items, error, iconName, iconColor, loading }) => (
  <>
    <Text style={homeStyles.titleSection}>{title}</Text>
    {loading ? (
      <ActivityIndicator size="large" color="rgb(255, 255, 255)" style={{ marginVertical: 20 }} />
    ) : error ? (
      <Text style={homeStyles.titleExtra}>{error}</Text>
    ) : items.length > 0 ? (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => (
  <Animatable.View
    key={`${item.link}-${index}`} // Using item.link (unique YouTube URL) plus index as a backup
    animation="fadeInUp"
    duration={800}
    style={{ marginVertical: 10 }}
  >
    <TouchableOpacity style={{ marginRight: 15 }} onPress={() => item.link && Linking.openURL(item.link)}>
      <View style={{ borderRadius: 15, overflow: "hidden", backgroundColor: "rgb(255, 255, 255)", width: 170 }}>
        {item.image && <Image source={{ uri: item.image }} style={{ width: "100%", height: 110 }} resizeMode="cover" />}
        <View style={{ padding: 8, flexDirection: "row", alignItems: "center" }}>
          <Ionicons name={iconName as any} size={20} color={iconColor} style={{ marginRight: 8 }} />
          <Text style={[homeStyles.titleExtra, { flex: 1, fontWeight: "bold", fontSize: 14, color: "rgb(77, 77, 77)" }]} numberOfLines={2}>
            {item.label}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  </Animatable.View>
))}

      </ScrollView>

    ) : (
      <Text style={homeStyles.titleExtra}>No se encontraron videos.</Text>
    )}
  </>
);

const InformacionYVideos = () => {
  const [videosData, setVideosData] = useState<{ Alimentacion: any[]; MINSA: any[] }>({
    Alimentacion: [],
    MINSA: [],
  });
  const [errors, setErrors] = useState<{ Alimentacion: string | null; MINSA: string | null }>({
    Alimentacion: null,
    MINSA: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      const timeoutDuration = 10000; // 10 segundos de tiempo máximo para las solicitudes
      let timeoutReached = false;
    
      // Esta función que se ejecuta cuando el tiempo se acaba sin respuestas exitosas
      const timeout = setTimeout(() => {
        timeoutReached = true; // Marca que el tiempo de espera se alcanzó
        setLoading(false);     // Finaliza la carga (aunque los datos no se hayan recibido)
        setErrors({
          Alimentacion: "Tiempo de espera agotado.",
          MINSA: "Tiempo de espera agotado.",
        });
      }, timeoutDuration);
    
      try {
        // Establecemos el estado de carga como verdadero antes de iniciar las solicitudes
        setLoading(true);
    
        // Esperamos todas las solicitudes usando Promise.all
        await Promise.all([
          fetchData(
            "alimentacion niños reducir anemia",
            (data) => {
              if (!timeoutReached) {
                setVideosData((prev) => ({ ...prev, Alimentacion: data as any[] }));
              }
            },
            (error) => {
              if (!timeoutReached) {
                setErrors((prev) => ({ ...prev, Alimentacion: error as string | null }));
              }
            }
          ),
          fetchData(
            "anemia niños MINSA Perú",
            (data) => {
              if (!timeoutReached) {
                setVideosData((prev) => ({ ...prev, MINSA: data as any[] }));
              }
            },
            (error) => {
              if (!timeoutReached) {
                setErrors((prev) => ({ ...prev, MINSA: error as string | null }));
              }
            }
          ),
        ]);
    
        // Si las solicitudes son exitosas, limpiamos el timeout
        if (!timeoutReached) {
          clearTimeout(timeout);
          setLoading(false); // Finalizamos la carga
        }
      } catch {
        // En caso de error, también desactivamos el loading y mostramos el error
        if (!timeoutReached) {
          clearTimeout(timeout); // Limpiamos el timeout si hubo error
          setLoading(false);
          setErrors({
            Alimentacion: "No se pudo cargar los videos de Alimentación.",
            MINSA: "No se pudo cargar los videos del MINSA.",
          });
        }
      }
    };
    
    fetchAllData();
    
  }, []);

  return (
    <View>
      <VideoSection iconName="logo-youtube" iconColor="rgb(237, 16, 16)" title="- Alimentación" items={videosData.Alimentacion} error={errors.Alimentacion} loading={loading} />
      <VideoSection iconName="logo-youtube" iconColor="rgb(237, 16, 16)" title="- Recomendaciones del MINSA" items={videosData.MINSA} error={errors.MINSA} loading={loading} />
    </View>
  );
};

export default InformacionYVideos;
