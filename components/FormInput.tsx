import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";

interface FormInputProps {
  label?: string; // Hacemos opcional el label
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  icon?: React.ReactNode; // Ícono a la izquierda
  iconRight?: React.ReactNode; // Ícono a la derecha
  validateEmail?: boolean; // Validar correo electrónico
  validateUsername?: boolean; // Validar usuario (solo letras)
  editable?: boolean; // Hacemos editable por defecto
  validateDate?: boolean; // Validar fecha de nacimiento
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad" | "decimal-pad"; // Tipos de teclado
  maxLength?: number; // Longitud máxima del texto
  autoCapitalize?: "none" | "sentences" | "words" | "characters"; // Auto-capitalización
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  icon,
  iconRight,
  validateEmail = false,
  validateUsername = false,
  validateDate = false,
  keyboardType = "default", // Valor por defecto
  maxLength,
  autoCapitalize = "none", // Valor por defecto
  editable = true, // Hacemos editable por defecto
}) => {
  const [isError, setIsError] = useState(false);

  const handleTextChange = (text: string) => {
    let filteredText = text;

    // Validación de usuario (solo letras)
    if (validateUsername) {
      filteredText = text.replace(/[^a-zA-Z\s]/g, ""); // Elimina números y símbolos, permite espacios
    }
    
    // Validación de fecha de nacimiento (formato dd/mm/yyyy)
    if (validateDate) {
      // Aquí puedes agregar una validación más compleja si lo deseas
      filteredText = text.replace(/[^0-9/]/g, ""); // Solo números y barras
    }

    // Validación de correo electrónico
    if (validateEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsError(!emailRegex.test(filteredText) && filteredText !== "");
    }

    onChangeText(filteredText); // Actualizar el texto filtrado
  };

  return (
    <View style={styles.formGroup}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[styles.inputWrapper, isError && validateEmail ? styles.errorInput : null]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[styles.input, icon || iconRight ? styles.withIcons : null]}
          value={value}
          onChangeText={handleTextChange}
          secureTextEntry={secureTextEntry}
          placeholderTextColor="#999"
          keyboardType={keyboardType} // Aquí se pasa la propiedad keyboardType
          maxLength={maxLength} // Aquí se pasa la propiedad maxLength
          autoCapitalize={autoCapitalize} // Aquí se pasa la propiedad autoCapitalize
          editable={editable} // Aquí se pasa la propiedad editable
        />
        {iconRight && <View style={styles.iconRightContainer}>{iconRight}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    color: "rgb(202, 202, 202)",
    marginBottom: 5,
    fontFamily: "ArvoBold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "rgb(251, 250, 250)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
  },
  input: {
    flex: 1, // Ocupa el espacio restante
    fontSize: 17,
    color: "#333",
    height: "100%",
    fontFamily: "ArvoRegular",
  },
  withIcons: {
    paddingLeft: 10, // Espaciado adicional si hay íconos
  },
  iconContainer: {
    marginRight: 10,
  },
  iconRightContainer: {
    marginLeft: 10,
  },
  errorInput: {
    borderColor: "red",
  },
});

export default FormInput;