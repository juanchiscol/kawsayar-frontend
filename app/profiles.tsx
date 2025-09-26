import { router, Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { profilesStyles } from "@/styles/profiles-styles";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/Button";
import CustomModal from "../components/Modals/ModalForms";
import { globalStyles } from '@/styles/global-styles';
import Toast from "react-native-toast-message";
import { useProfile } from "@/app/AppContext";
import { fetchAllProfiles, registerProfile } from "@/apis/apis"; // Importa la función
import { imageMapper } from "@/constants/imageMapper";  // Importa el mapeo de imágenes

interface Profile {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  dni: string;
  ft_perfil: string;
  sexo: string;
  edad: string;
  fecha_nacimiento: string;
}

const Profiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { data } = useLocalSearchParams();
  const user = JSON.parse(Array.isArray(data) ? data[0] : data);
  const { id, nombres, apellido_paterno, apellido_materno } = user;

  const [modalVisible, setModalVisible] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileApellidoPaterno, setNewProfileApellidoPaterno] = useState("");
  const [newProfileApellidoMaterno, setNewProfileApellidoMaterno] = useState("");
  const [edad, setEdad] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [dni, setDni] = useState("");
  const [sexo, setSexo] = useState("");

  const fetchProfiles = useCallback(async () => {
    try {
      const profiles = await fetchAllProfiles(id);
      setProfiles(profiles);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (data) fetchProfiles();
  }, [data, fetchProfiles]);

  const { setProfile, setUser } = useProfile();

  const handleProfileSelect = (profile: Profile) => {
    const user = JSON.parse(Array.isArray(data) ? data[0] : data);
    setUser(user);
    setProfile(profile);
    router.replace(`/homeScreen`);
  };

  const formatearNombre = (nombre: string, apellido_paterno: string, apellido_materno: string) => {
    const [primerNombre, ...otrosNombres] = nombre.split(" ");
    const nombresAbreviados = otrosNombres.map(n => `${n.charAt(0).toUpperCase()}.`).join(" ");
    return `${primerNombre} ${nombresAbreviados} ${apellido_paterno} ${apellido_materno.charAt(0).toUpperCase()}.`;
  };

  const getRandomProfilePicture = (sexo: string) => {
    // Filtramos las imágenes que ya están en uso
    const usedImages = profiles.map(profile => profile.ft_perfil);

    // Obtenemos las claves de las imágenes disponibles para el sexo correspondiente
    const imageKeys = Object.keys(imageMapper).filter((key) =>
      sexo.toLowerCase() === "f" ? key.startsWith("fotoF") : key.startsWith("fotoM")
    );

    // Filtramos las imágenes que ya están en uso
    const availableImages = imageKeys.filter(image => !usedImages.includes(image));

    // Si hay imágenes disponibles, seleccionamos una al azar; si no, usamos una imagen predeterminada
    return availableImages.length > 0
      ? availableImages[Math.floor(Math.random() * availableImages.length)]
      : "default-profile.jpg"; // Fallback si no hay imágenes disponibles
  };
// Función para convertir la fecha de dd/mm/yyyy a yyyy-mm-dd
const convertToDateFormat = (date: string) => {
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
};

  const handleConfirmProfile = async () => {

    const newProfile = {
      id_usuario: id,
      nombres: newProfileName,
      apellido_paterno: newProfileApellidoPaterno,
      apellido_materno: newProfileApellidoMaterno,
      edad: parseInt(edad),
      fecha_nacimiento: convertToDateFormat(fechaNacimiento), // Convertimos la fecha al formato adecuado
      dni,
      sexo: sexo,
      ft_perfil: getRandomProfilePicture(sexo),
    };
    try {
      const profileData = await registerProfile(newProfile); // Usamos la función que creamos
      showToast("success", "Perfil creado con éxito.");
      setModalVisible(false);
      setProfiles(prevProfiles => [...prevProfiles, profileData]);
    } catch (error: any) {
      showToast("error", error.message);
    }
  };

  const handleAddProfile = () => {
    if (profiles.length >= 6) {
      showToast("error", "Ya no se pueden agregar más perfiles.");
    } else {
      setModalVisible(true);
    }
  };

  const showToast = (type: string, text2: string) => {
    Toast.show({
      type,
      text2,
      visibilityTime: 3000,
      autoHide: true,
      text2Style: {
        fontSize: 16,
        color: "#333",
        fontWeight: "normal",
        fontFamily: "ArvoRegular",
      },
    });
  };



  return (
    <View style={globalStyles.screen}>
            <Toast />

      <Stack.Screen options={{ title: "Perfiles", headerShown: false, headerLeft: () => null, gestureEnabled: false }} />
      <StatusBar style="light" />

      <View style={profilesStyles.headerContainer}>
        <View>
          <Text style={profilesStyles.welcomeText}>Bienvenido de nuevo,</Text>
          <Text style={profilesStyles.username}>{formatearNombre(nombres, apellido_paterno, apellido_materno)}</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace("/Login")}>
          <Ionicons name="exit" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={profilesStyles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : profiles.length > 0 ? (
          profiles.map((profile) => (
            <TouchableOpacity key={profile.id} onPress={() => handleProfileSelect(profile)}>
              <View style={profilesStyles.profileCard}>
                <View style={profilesStyles.profileImageContainer}>
                  <Image source={imageMapper[profile.ft_perfil] || imageMapper['default-profile.jpg']} style={profilesStyles.profileImage} />
                </View>
                <Text style={profilesStyles.profileName}>{formatearNombre(profile.nombres, profile.apellido_paterno, profile.apellido_materno)}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={profilesStyles.noProfilesText}>No cuenta con perfiles...</Text>
        )}
      </View>
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmProfile}
        title="Crear Perfil"
        inputs={[
          { label: "DNI", value: dni, onChangeText: setDni, keyboardType: "numeric", maxLength: 8 },
          { label: "Nombre", value: newProfileName, onChangeText: setNewProfileName, validateUsername: true },
          { label: "Apellido Paterno", value: newProfileApellidoPaterno, onChangeText: setNewProfileApellidoPaterno, validateUsername: true },
          { label: "Apellido Materno", value: newProfileApellidoMaterno, onChangeText: setNewProfileApellidoMaterno, validateUsername: true },
          { label: "Fecha de Nac", value: fechaNacimiento, onChangeText: setFechaNacimiento, validateDate: true },
          { label: "Edad", value: edad, onChangeText: setEdad, keyboardType: "numeric", maxLength: 2 },
          { label: "Sexo", value: sexo, onChangeText: setSexo },
        ]}
      />
      <Button
        onPress={handleAddProfile}
        title="Añadir un nuevo perfil"
        backgroundColor="rgb(72, 187, 171)"
        textColor="#000000"
        icon={<Ionicons name="person-add" size={25} color="#000000" />}
      />
    </View>
  );
};

export default Profiles;
