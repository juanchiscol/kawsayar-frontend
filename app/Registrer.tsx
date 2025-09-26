import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";

import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { registerUser, handleEmailVerification, handleVerifyEmailCode } from "@/apis/apis";
import { registrerStyles } from "@/styles/registrer-styles";
import { globalStyles } from "@/styles/global-styles";

const initialForm: Record<string, string> = {
  email: "", password: "", nombres: "", apellido_paterno: "", apellido_materno: "",
  dni: "", celular: "", direccion: "", departamento: "", provincia: "", distrito: "", edad: ""
};

const Register = () => {
  const [formData, setFormData] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false); // To track if the code is sent

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toast = (msg: string, type: "success" | "error" = "error") =>
    Toast.show({ type, text2: msg, visibilityTime: 3000, text2Style: toastStyle });

  const toastStyle = {
    fontSize: 16,
    color: "#333",
    fontWeight: "normal" as const,
    fontFamily: "ArvoRegular",
  };

  const validateForm = () => {
    const { dni, celular, edad, email } = formData;

    if (Object.values(formData).some(v => !v)) return "Completa todos los campos.";
    if (dni.length !== 8 || isNaN(Number(dni))) return "El DNI debe tener 8 dígitos.";
    if (celular.length !== 9 || isNaN(Number(celular))) return "El celular debe tener 9 dígitos.";
    if (isNaN(Number(edad)) || Number(edad) < 1) return "La edad debe ser un número válido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Correo electrónico inválido.";
    return "";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendVerificationCode = async (email: string, dni: string) => {
    try {
      const response = await handleEmailVerification(email, dni); // Llamamos a la API que envía el código
      if (response.result) {
        // Mostrar el campo para ingresar el código de verificación
        toast("Código de verificación enviado al correo.", "success");
        setIsCodeSent(true); // El código fue enviado
      } else {
        toast(response.error || "Hubo un error al enviar el código.");
      }
    } catch (error) {
      console.error(error);
      toast("Ocurrió un error al intentar enviar el código.");
    }
  };

  const handleVerifyCode = async (code: string) => {
    const { email } = formData;
    try {
      const response = await handleVerifyEmailCode(email, code); // Llamamos a la API de verificación
      if (response.result) {
        // Si el código es válido
        setIsCodeValid(true); // El código es válido
        toast("Código validado correctamente.", "success");
      } else {
        setIsCodeValid(false);
        toast("Código incorrecto o expirado.", "error");
      }
    } catch {
      toast("Error al verificar el código.", "error");
    }
  };

  const handleRegister = async () => {
    const errorMsg = validateForm();
    if (errorMsg) return toast(errorMsg);

    try {
      const res = await registerUser(formData);
      if (res.result) {
        toast("Registro exitoso", "success");
        setFormData(initialForm);
        setTimeout(() => router.replace("/Login"), 1000);
      }else {
        // Si no hay campo `result`, mostrar el error que se haya recibido
        toast(res.error || "Ocurrió un error desconocido."); }
    } catch {
      toast("Hubo un problema con el servidor.");
    }
  };

  const renderInput = (
    label: string,
    key: string,
    options: {
      keyboardType?: any;
      maxLength?: number;
      secureTextEntry?: boolean;
      iconRight?: React.ReactNode;
      validateEmail?: boolean;
      validateUsername?: boolean;
    } = {}
  ) => (
    <FormInput
      label={label}
      value={formData[key]}
      onChangeText={(v) => handleChange(key, v)}
      {...options}
    />
  );

  return (
    <View style={globalStyles.screen}>
      <Stack.Screen options={{ title: "Registro", headerShown: false }} />
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        enabled={Platform.OS === "ios"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={globalStyles.headerContainer}>
              <Text style={registrerStyles.title}>SACN</Text>
            </View>

            <View style={registrerStyles.tabContainer}>
              <TouchableOpacity style={[registrerStyles.tab, registrerStyles.activeTab]}>
                <Text style={[registrerStyles.tabText, registrerStyles.activeTabText]}>
                  Registrar
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={registrerStyles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={registrerStyles.formContainer}>
                <FormRow>
                  {renderInput("DNI", "dni", { keyboardType: "numeric", maxLength: 8 })}
                  {renderInput("Nombres", "nombres", { validateUsername: true })}
                </FormRow>
                <FormRow>
                  {renderInput("Apellido Paterno", "apellido_paterno", { validateUsername: true })}
                  {renderInput("Apellido Materno", "apellido_materno", { validateUsername: true })}
                </FormRow>
                <FormRow>
                  {renderInput("Celular", "celular", { keyboardType: "numeric", maxLength: 9 })}
                  {renderInput("Edad", "edad", { keyboardType: "numeric", maxLength: 2 })}
                </FormRow>
                {renderInput("Correo Electrónico", "email", { validateEmail: true })}

                {/* Botón de Enviar código y Validar código */}


                {isCodeSent && (
                  <FormInput
                    label="Código de verificación"
                    value={verificationCode}
                    onChangeText={(v) => setVerificationCode(v)}
                    keyboardType="numeric"
                  />
                )}
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Button
                    onPress={() => handleSendVerificationCode(formData.email, formData.dni)}
                    title="Enviar código"
                    backgroundColor="rgb(72, 187, 171)"
                    textColor="#000000"
                    disabled={!validateEmail(formData.email) }
                    width={"48%"}
                    marginTop={0}
                    marginBottom={10}
                  />
                  {isCodeSent && (
                    <Button
                      onPress={() => handleVerifyCode(verificationCode)}
                      title="Validar código"
                      backgroundColor="rgb(72, 187, 171)"
                      textColor="#000000"
                      disabled={!verificationCode}
                      width={"48%"}
                      marginTop={0}
                      marginBottom={10}
                    />
                  )}
                </View>
                <FormRow>
                  {renderInput("Contraseña", "password", {
                    secureTextEntry: !showPassword,
                    iconRight: (
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#666" />
                      </TouchableOpacity>
                    ),
                  })}
                  {renderInput("Departamento", "departamento")}
                </FormRow>
                <FormRow>
                  {renderInput("Provincia", "provincia")}
                  {renderInput("Distrito", "distrito")}
                </FormRow>
                {renderInput("Dirección", "direccion")}
              </View>
                {/* Aceptar términos y condiciones */}
              <View style={registrerStyles.termsContainer}>
                <Text style={registrerStyles.termsText}>
                  Al registrarte, aceptas nuestros{" "}
                  <Text
                    style={registrerStyles.termsLink}
                  >
                    términos y condiciones
                  </Text>
                </Text>
              </View>
            </ScrollView>

            <View style={registrerStyles.buttonContainer}>
              <Button
                onPress={handleRegister}
                title="Registrarse"
                backgroundColor="rgb(72, 187, 171)"
                textColor="#000000"
                disabled={!isCodeValid}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Toast />
    </View>
  );
};

const FormRow = ({ children }: { children: React.ReactNode[] }) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
    <View style={{ flex: 1 }}>{children[0]}</View>
    <View style={{ flex: 1 }}>{children[1]}</View>
  </View>
);

export default Register;
