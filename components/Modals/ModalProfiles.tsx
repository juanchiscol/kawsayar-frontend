import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import CustomModal from "./CustomModal";
import { homeStyles } from "@/styles/home-styles";
import Button from "../Button";
import { perfilStyles } from "@/styles/perfil-styles";
import { imageMapper } from "@/constants/imageMapper";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Definimos el tipo Profile
interface Profile {
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  dni: string;
  ft_perfil: string;
}

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  profiles: Profile[];
  onSelectProfile: (perfil: Profile) => void;
  userInfo: any;
}

const formatearNombre = (
  nombre: string,
  apellido_paterno: string,
  apellido_materno: string
) => {
  const [primerNombre, ...otrosNombres] = nombre.split(" ");
  return `${primerNombre} ${otrosNombres
    .map((n) => `${n.charAt(0).toUpperCase()}.`)
    .join(" ")} ${apellido_paterno} ${apellido_materno.charAt(0).toUpperCase()}.`;
};

    
const ModalProfiles: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  profiles,
  onSelectProfile,
  userInfo
}) => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const handleProfileSelect = (perfil: Profile) => {
    setSelectedProfile(perfil);
  };

  return (
    <CustomModal visible={visible} onClose={onClose}>
      <View>
        {/* Barra superior */}
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <View style={{ width: 50, height: 5, backgroundColor: "#888", borderRadius: 10 }} />
        </View>

        <Text style={{ color: "rgb(72, 187, 171)", fontSize: 18, fontFamily: "ArvoBold", marginBottom: 20 }}>
          {title}
        </Text>

        {profiles.length === 0 ? (
          <Text style={[homeStyles.text, { textAlign: "center"}]}>
            No cuenta con más perfiles
          </Text>
        ) : (
<ScrollView>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
              {profiles.map((perfil) => (
                <View key={perfil.dni} style={perfilStyles.siguienteControl}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                      <View style={perfilStyles.profileImageContainer}>
                        <Image
                          source={imageMapper[perfil.ft_perfil] || imageMapper["default-profile.jpg"]}
                          style={perfilStyles.profileImage}
                        />
                      </View>
                      <Text style={[homeStyles.text, { marginLeft: 10, fontSize: 16, fontWeight: "500" }]}>
                        {formatearNombre(perfil.nombres, perfil.apellido_paterno, perfil.apellido_materno)}
                      </Text>
                    </View>

                    {/* Icono de check al extremo derecho */}
                    <TouchableOpacity onPress={() => handleProfileSelect(perfil)} style={{ marginLeft: 10 }}>
                      <Ionicons
                        name={selectedProfile?.dni === perfil.dni ? "checkmark-circle" : "ellipse-outline"}
                        size={30}
                        color={selectedProfile?.dni === perfil.dni ? "#72BBAB" : "gray"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Confirmación fuera del modal */}
        <Button
          onPress={() => {
            if (profiles.length === 0) {
               router.replace(`/profiles?data=${encodeURIComponent(JSON.stringify(userInfo))}`);
            } else if (selectedProfile) {
              onSelectProfile(selectedProfile);
              onClose(); // Cerrar el modal
              router.replace("/homeScreen"); // Redirigir a la pantalla de perfil
            }
          }}
          icon={<FontAwesome5 name="user-plus" size={20} color="black" />}
          title={profiles.length === 0 ? "Quiero agregar un perfil" : "Confirmar Selección"}
          backgroundColor="rgb(72, 187, 171)"
          textColor="black"
        />
      </View>
    </CustomModal>
  );
};



export default ModalProfiles;