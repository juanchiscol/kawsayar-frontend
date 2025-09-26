import { deleteProfile, fetchAllProfiles, logoutUser } from "@/apis/apis";
import { useProfile } from "@/app/AppContext";
import Button from "@/components/Button";
import { imageMapper } from "@/constants/imageMapper";
import { globalStyles } from "@/styles/global-styles";
import { homeStyles } from "@/styles/home-styles";
import { perfilStyles } from "@/styles/perfil-styles";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Stack,useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import ModalInfoProfilesUser from "../../components/Modals/InfoUser";
import ModalProfiles from "../../components/Modals/ModalProfiles";

// PerfilScreen Component
const PerfilScreen = () => {
  const { user, profile, setProfile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const router = useRouter();

  const { nombres, apellido_paterno, apellido_materno, dni, ft_perfil, id, } = profile ?? {};

  const userInfo = {
    id: user?.id ?? 0,
    apellido_materno: user?.apellido_materno ?? "",
    apellido_paterno: user?.apellido_paterno ?? "",
    dni: user?.dni ?? "",
    email: user?.email ?? "",
    nombres: user?.nombres ?? "",
    celular: user?.celular ?? "",
    edad: user?.edad ?? "",
  };

  const showToast = (type: "error" | "success", message: string) => {
    Toast.show({
      type,
      position: "top",
      text2: message,
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

  // Fetch profiles from API
  const fetchProfiles = useCallback(async () => {
    try {
      const profilesData = await fetchAllProfiles(user?.id ?? 0);
      setProfiles(profilesData);
      setFilteredProfiles(profilesData.filter((p: { dni: string }) => p.dni !== dni));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user, dni]);

  const handleDeleteProfile = async (profileId: number) => {
    try {
      const response = await deleteProfile(profileId);
      if (response.message) {
        showToast("success", "Perfil eliminado con éxito.");
        setTimeout(() => router.replace(`/profiles?data=${encodeURIComponent(JSON.stringify(userInfo))}`), 1000);
      } else {
        showToast("error", "No se pudo eliminar el perfil.");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error al eliminar el perfil.");
    }
  };

  const handleProfileChange = (newProfile: any) => {
    setProfile(newProfile);
    setModalVisible(false);
  };

  const formatearNombre = (nombre: string, apellido_paterno: string, apellido_materno: string) => {
    const [primerNombre, ...otrosNombres] = nombre.split(" ");
    return `${primerNombre} ${otrosNombres.map((n) => `${n.charAt(0).toUpperCase()}.`).join(" ")} ${apellido_paterno} ${apellido_materno.charAt(0).toUpperCase()}.`;
  };

  const handleEliminarPerfil = () => {
    Alert.alert("Eliminar Perfil", "¿Estás seguro de que deseas eliminar este perfil?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", onPress: () => id !== undefined && handleDeleteProfile(id) },
    ]);
  };

  const fetchCerrarSesion = async () => {
    try {
      const responselog = await logoutUser();

      if (responselog.result) {
        showToast("success", "Sesión cerrada con éxito.");
        setTimeout(() => router.replace(`/`), 1000);
      } else {
        showToast("error", "No se pudo cerrar la sesión.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const hableCerrarSesion = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar Sesión", onPress: fetchCerrarSesion }, // Llamada directa sin función anónima
    ]);
  };

  useEffect(() => {
    if (user) fetchProfiles();
  }, [user, fetchProfiles]);

  return (
    <View style={homeStyles.screen}>
                <Stack.Screen
        options={{
          title: "Perfil",
          headerShown: false,
        }}
      />  
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 20 }}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <>
            <View style={globalStyles.headerContainer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="person" size={24} color="#AAAAAA" />
                <Text style={[globalStyles.titleapp, { marginLeft: 10 }]}>Tu Perfil</Text>
              </View>
              <TouchableOpacity onPress={() => setModalInfoVisible(true)}>

                <View style={[perfilStyles.siguienteControl, { marginVertical: 20 }]}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={perfilStyles.profileImageContainer}>
                      <Image source={imageMapper[ft_perfil ?? 'default-profile.jpg']} style={perfilStyles.profileImage} />
                    </View>
                    <Text style={[homeStyles.text, { marginLeft: 10 }]}>{formatearNombre(nombres ?? "", apellido_paterno ?? "", apellido_materno ?? "")}</Text>
                  </View>

                  <Ionicons name="caret-down-circle" size={40} color="#fff" />
                </View>
              </TouchableOpacity>

              <View style={[perfilStyles.siguienteControl, { flexDirection: "column", alignContent: "flex-start", alignItems: "flex-start" }]}>
                <Text style={{ color: "rgb(255, 255, 255)", fontSize: 18, fontFamily: "ArvoBold", marginBottom: 20 }}>
                  Acciones de Perfil
                </Text>

                <Button
                  title="Crear nuevo perfil"
                  onPress={() => router.replace("/profiles?data=" + encodeURIComponent(JSON.stringify(userInfo)) as any)}
                  backgroundColor="#FFF"
                  textColor="#000"
                  icon={<AntDesign name="user-add" size={20} color="#000" />}
                />

                <Button
                  onPress={() => setModalVisible(true)}
                  title="Cambiar de perfil"
                  backgroundColor="#FFF"
                  textColor="#000"
                  icon={<AntDesign name="swap" size={20} color="#000" />}
                />
                <Button
                  onPress={handleEliminarPerfil}
                  title="Eliminar Perfil"
                  backgroundColor="#FFF"
                  textColor="rgb(201, 67, 67)"
                  icon={<FontAwesome5 name="user-times" size={20} color="rgb(201, 67, 67)" />}
                />

              </View>


            </View>
            <View >
              <Button
                onPress={hableCerrarSesion}
                title=" Cerrar sesión"
                backgroundColor="rgb(240, 101, 101)"
                textColor="#fff"
                icon={<Ionicons name="exit" size={25} color="#fff" />}
              />

            </View>
          </>
        )}
      </View>

      <ModalProfiles
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => handleProfileChange(profile)}
        title="Cambio de Perfil"
        profiles={filteredProfiles}
        onSelectProfile={handleProfileChange}
        userInfo={userInfo}
      />
      <ModalInfoProfilesUser
        visible={modalInfoVisible}
        onClose={() => setModalInfoVisible(false)}
        title="Información"
        profiles={[profile ?? {
          nombres: "", apellido_paterno: "", apellido_materno: "", dni: "",
          ft_perfil: "", edad: "", fecha_nacimiento: ""
        }]}
        userInfo={userInfo}
      />
      <Toast />

    </View>
  );
};

export default PerfilScreen;
