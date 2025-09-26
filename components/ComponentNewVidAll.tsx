import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, Linking, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Animatable from "react-native-animatable";
import { homeStyles } from "@/styles/home-styles";

interface Item {
  label: string;
  link?: string;
  image?: string;
}

const fetchData = async (url: string, setData: React.Dispatch<React.SetStateAction<Item[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  try {
    const response = await axios.get(url);
    const data = response.data.items || response.data.articles;
    const formattedData = data.map((item: any) => ({
      label: item.snippet?.title || item.title,
      link: item.snippet?.url || item.url,
      image: item.snippet?.thumbnails?.high?.url || item.urlToImage,
    }));
    
    // Verifica si los datos son válidos
    if (formattedData.length > 0) {
      setData(formattedData);
    } else {
      setError("No se encontraron resultados.");
    }
    
  } catch {
    setError("No se pudo cargar los datos.");
  }
};

const CardItem = ({ item, iconName, iconColor }: { item: Item; iconName: string; iconColor: string }) => (
  <Animatable.View
    animation="fadeInUp"
    duration={800}
    style={{ width: "48%", marginBottom: 15 }}
  >
    <TouchableOpacity onPress={() => item.link && Linking.openURL(item.link)}>
      <View style={{ borderRadius: 15, overflow: "hidden", backgroundColor: "rgb(255, 255, 255)", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8 }}>
        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: 140, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
          />
        )}
        <View style={{ padding: 10, flexDirection: "row", alignItems: "center" }}>
          <Ionicons name={iconName as any} size={20} color={iconColor} style={{ marginRight: 8 }} />
          <Text style={[homeStyles.titleExtra, { flex: 1, fontWeight: "bold", fontSize: 14, color: "rgb(77, 77, 77)" }]} numberOfLines={2}>
            {item.label}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  </Animatable.View>
);

const Section = ({ title, items, error, iconName, iconColor, isLoading }: { title: string; items: Item[]; error: string | null; iconName: string; iconColor: string; isLoading: boolean }) => (
  <View style={{ marginTop: 20 }}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={[homeStyles.titleSection]}>{title}</Text>
    </View>
    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>) : error ? (
          <Text style={homeStyles.titleExtra}>{error}</Text>
        ) : items.length > 0 ? (
          items.map((item, index) => <CardItem key={index} item={item} iconName={iconName} iconColor={iconColor} />)
        ) : (
        <Text style={homeStyles.titleExtra}>Cargando...</Text>
      )}
    </View>
  </View>
);

const ComponentNewVidAll = () => {
  const [informacion, setInformacion] = useState<Item[]>([]);
  const [videos, setVideos] = useState<Item[]>([]);
  const [videosMinSa, setVideosMinSa] = useState<Item[]>([]);
  const [errorInformacion, setErrorInformacion] = useState<string | null>(null);
  const [errorVideos, setErrorVideos] = useState<string | null>(null);
  const [errorVideosMinSa, setErrorVideosMinSa] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const NEW_API_KEY = "5fa26b8fdb554a78bfea713ee0aeb34d";
    const YOUTUBE_API_KEY = "AIzaSyDl8w5EVA_3KvoDLFs6T0NrLoyIMH9nZ40";
    const fetchAllData = async () => {
      const timeoutDuration = 10000; // 10 segundos de tiempo máximo para las solicitudes
      let timeoutReached = false;
    
      // Esta función que se ejecuta cuando el tiempo se acaba sin respuestas exitosas
      const timeout = setTimeout(() => {
        timeoutReached = true; // Marca que el tiempo de espera se alcanzó
        setIsLoading(false);   // Finaliza la carga (aunque los datos no se hayan recibido)
        setErrorInformacion("Tiempo de espera agotado.");
        setErrorVideos("Tiempo de espera agotado.");
        setErrorVideosMinSa("Tiempo de espera agotado.");
      }, timeoutDuration);
    
      try {
        // Establecemos el estado de carga como verdadero antes de iniciar las solicitudes
        setIsLoading(true);
    
        // Esperamos todas las solicitudes usando Promise.all
        await Promise.all([
          fetchData(`https://newsapi.org/v2/everything?q=anemia+menores&language=es&apiKey=${NEW_API_KEY}`, setInformacion, setErrorInformacion),
          fetchData(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=alimentacion niños reducir anemia&key=${YOUTUBE_API_KEY}`, setVideos, setErrorVideos),
          fetchData(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=anemia niños MINSA Perú&key=${YOUTUBE_API_KEY}`, setVideosMinSa, setErrorVideosMinSa)
        ]);
    
        // Si las solicitudes son exitosas, limpiamos el timeout
        if (!timeoutReached) {
          clearTimeout(timeout);
          setIsLoading(false); // Finalizamos la carga
        }
      } catch {
        // En caso de error, también desactivamos el loading y mostramos el error
        if (!timeoutReached) {
          clearTimeout(timeout); // Limpiamos el timeout si hubo error
          setIsLoading(false);
          setErrorInformacion("No se pudo cargar la información.");
          setErrorVideos("No se pudo cargar los videos.");
          setErrorVideosMinSa("No se pudo cargar los videos del MINSA.");
        }
      }
    };
    
    fetchAllData();
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Section title="- Alimentación" items={videos} error={errorVideos} iconName="logo-youtube" iconColor="rgb(237, 16, 16)" isLoading={isLoading} />
      <Section title="- Recomendaciones del MINSA" items={videosMinSa} error={errorVideosMinSa} iconName="logo-youtube" iconColor="rgb(237, 16, 16)" isLoading={isLoading} />
      <Section title="- Noticias y artículos" items={informacion} error={errorInformacion} iconName="newspaper" iconColor="rgb(72, 187, 171)" isLoading={isLoading} />
    </ScrollView>
  );
};

export default ComponentNewVidAll;
