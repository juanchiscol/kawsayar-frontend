import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Button from "../Button";
import FormInput from "../FormInput";
import DateInput from "../DateInput"; // Importa el nuevo componente
import CustomModal from "./CustomModal";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  inputs: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: "default" | "numeric";
    validateUsername?: boolean;
    validateDate?: boolean;
    maxLength?: number;
  }[];
}

const ModalForms: React.FC<CustomModalProps> = ({ visible, onClose, onConfirm, title, inputs }) => {
  const clearform = () => {
    inputs.forEach((input) => input.onChangeText(""));
  };

  const toast = (msg: string, type: "success" | "error" = "error") =>
    Toast.show({ type, text2: msg, visibilityTime: 3000, text2Style: toastStyle });

  const toastStyle = {
    fontSize: 16,
    color: "#333",
    fontWeight: "normal" as const,
    fontFamily: "ArvoRegular",
  };

  const handleConfirm = () => {
    const emptyFields = inputs.filter(input => !input.value.trim());
    if (emptyFields.length > 0) {
      toast("Por favor, complete todos los campos.", "error");
      return;
    }
    onConfirm();
    clearform();
    onClose();
  };

  // Función para convertir la fecha de dd/mm/yyyy a yyyy-mm-dd
  const convertToDateFormat = (date: string) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  // Función para calcular la edad en base a la fecha de nac
  const calculateAge = (birthDate: string) => {
    // Convertir la fecha al formato adecuado para usar con new Date()
    const birth = new Date(convertToDateFormat(birthDate));
    const today = new Date();

    // Validación para asegurarse de que la fecha de nac sea válida
    if (isNaN(birth.getTime())) {
      console.error("fecha de nac no válida:", birthDate);
      return 0; // Retorna 0 si la fecha no es válida
    }

    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    // Ajustar la edad si no ha llegado el cumpleaños este año
    if (month < birth.getMonth() || (month === birth.getMonth() && day < birth.getDate())) {
      age--;
    }

    return age;
  };

  const handleDateChange = (date: string) => {
    const age = calculateAge(date);

    // Si la edad no está en el rango válido (0-5), mostramos un Toast y no actualizamos la fecha
    if (age < 0 || age > 5) {
      toast("El niño debe tener al menos 5 años.", "error");
    } else {
      // Si la edad está en el rango válido, actualizamos el campo de edad
      const ageInput = inputs.find(input => input.label.toLowerCase() === "edad");
      if (ageInput) {
        ageInput.onChangeText(age.toString()); // Actualizamos la edad si es válida
      }
    }

    // Actualizamos la fecha de nac en el campo correspondiente
    const birthInput = inputs.find(input => input.label.toLowerCase() === "fecha de nac");
    if (birthInput) {
      birthInput.onChangeText(date);
    }
  };

  useEffect(() => {
    // Si la fecha de nac se actualiza, calculamos la edad automáticamente
    const birthInput = inputs.find(input => input.label.toLowerCase() === "fecha de nac");
    if (birthInput && birthInput.value) {
      const age = calculateAge(birthInput.value);
      const ageInput = inputs.find(input => input.label.toLowerCase() === "edad");
      if (ageInput) {
        if (age >= 0 && age <= 5) {
          // Solo actualizamos el campo de edad si la edad está entre 0 y 5
          ageInput.onChangeText(age.toString());
        } else {
          // Limpiamos el campo de edad si no está en el rango 0-5
          ageInput.onChangeText("");
        }
      }
    }
  },);

  return (
    <CustomModal visible={visible} onClose={onClose}>
      <View>
        {/* Top bar for sliding */}
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <View style={{ width: 50, height: 5, backgroundColor: "#888", borderRadius: 10 }} />
        </View>

        <Text style={{ color: "rgb(72, 187, 171)", fontSize: 18, marginBottom: 20, fontFamily: "ArvoBold" }}>
          {title}
        </Text>

        <ScrollView>
          {/* Contenedor con flexbox para dos columnas */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            {inputs.map((input, index) => (
              <View key={index} style={{ width: "48%" }}>
                {input.label.toLowerCase() === "sexo" ? (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "rgb(202, 202, 202)",
                        fontFamily: "ArvoBold",
                        marginRight: 10,
                      }}
                    >
                      {input.label}
                    </Text>

                    <TouchableOpacity
                      onPress={() => input.onChangeText("M")}
                      style={{ flexDirection: "row", alignItems: "center", marginRight: 15 }}
                    >
                      <Ionicons
                        name={input.value === "M" ? "checkmark-circle" : "ellipse-outline"}
                        size={24}
                        color={input.value === "M" ? "rgb(72, 187, 171)" : "gray"}
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: 15,
                          color: "rgb(202, 202, 202)",
                          fontFamily: "ArvoBold",
                        }}
                      >
                        M
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => input.onChangeText("F")}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Ionicons
                        name={input.value === "F" ? "checkmark-circle" : "ellipse-outline"}
                        size={24}
                        color={input.value === "F" ? "rgb(72, 187, 171)" : "gray"}
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: 15,
                          color: "rgb(202, 202, 202)",
                          fontFamily: "ArvoBold",
                        }}
                      >
                        F
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : input.label.toLowerCase() === "fecha de nac" ? (
                  <DateInput
                    label={input.label}
                    value={input.value}
                    onChangeText={handleDateChange} // Usamos handleDateChange para la validación
                  />
                ) : input.label.toLowerCase() === "edad" ? (
                  <FormInput
                    label={input.label}
                    value={input.value}
                    onChangeText={input.onChangeText}
                    keyboardType="numeric"
                    editable={false} // Desactivamos la edición en el campo de edad
                  />
                ) : (
                  <FormInput
                    label={input.label}
                    value={input.value}
                    onChangeText={input.onChangeText}
                    keyboardType={input.keyboardType || "default"}
                    validateUsername={input.label.toLowerCase().includes("nombre") || input.label.toLowerCase().includes("apellido")}
                    maxLength={input.maxLength}
                  />
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        <Button
          onPress={handleConfirm}
          title="Confirmar"
          backgroundColor="rgb(72, 187, 171)"
          textColor="black"
        />
      </View>
    </CustomModal>
  );
};

export default ModalForms;
