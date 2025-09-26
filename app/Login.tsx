import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { loginUser, handleRecoverPassword, handleVerifyResetCode, handleResetPassword } from "@/apis/apis";
import { registrerStyles } from "@/styles/registrer-styles";
import { globalStyles } from "@/styles/global-styles";

// Validación de email
const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Toast reutilizable
const showToast = (type: "success" | "error", message: string) => {
  Toast.show({
    type,
    position: "top",
    text2: message,
    visibilityTime: 3000,
    autoHide: true,
    text2Style: {
      fontSize: 16,
      color: "#333",
      fontFamily: "ArvoRegular",
    },
  });
};

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"email" | "code" | "resetPassword">("email");

  // Iniciar sesión
  const handleLogin = async () => {
    if (!email || !password)
      return showToast("error", "Por favor, completa todos los campos.");

    if (!validateEmail(email))
      return showToast("error", "El correo electrónico no es válido.");

    try {
      const result = await loginUser(email, password);

      if (result.isValid) {
        showToast("success", "Éxito, Bienvenido.");
        setTimeout(() => {
          const userData = JSON.stringify(result.user);
          router.replace(`/profiles?data=${encodeURIComponent(userData)}`);
        }, 1000);
      } else if (result.isValid === false) {
        // Aquí mostramos un mensaje si las credenciales son incorrectas
        showToast("error", "Credenciales incorrectas.");
      }
    } catch (error) {
      // Si hubo un error al conectar con el servidor
      showToast("error", error instanceof Error ? error.message : "Hubo un problema con el servidor.");
    }
  };

  // Recuperar contraseña
  const handleRecoverPasswordButon = async () => {
    if (!email) {
      showToast("error", "Por favor, ingresa tu correo.");
      return;
    }
  
    try {
      const response = await handleRecoverPassword(email); 
      if (response.result) {
        showToast("success", "Te hemos enviado un código de recuperación.");
        setStep("code"); // Avanzamos al siguiente paso
      } else {
        // Si no hay campo `result`, mostrar el error que se haya recibido
        showToast("error", response.error || "Ocurrió un error desconocido.");
      }
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Ocurrió un error desconocido.");
    }
  };
  

  // Verificar el código de recuperación
  const handleVerifyResetCodeButton = async () => {
    if (!resetCode) {
      showToast("error", "Por favor, ingresa el código.");
      return;
    }

    try {
      const response = await handleVerifyResetCode(email, resetCode);
      if (response.result) {
        showToast("success", "Código válido. Ahora puedes cambiar tu contraseña.");
        setStep("resetPassword"); // Avanzamos al paso de cambiar la contraseña
      }else {
        // Si no hay campo `result`, mostrar el error que se haya recibido
        showToast("error", response.error || "Ocurrió un error desconocido.");
      }
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Ocurrió un error desconocido.");
    }
  };

  // Restablecer la contraseña
  const handleResetPasswordButton = async () => {
    if (!newPassword) {
      showToast("error", "Por favor, ingresa tu nueva contraseña.");
      return;
    }

    try {
      const response = await handleResetPassword(email, newPassword);
      if (response.result) {
        showToast("success", "Contraseña actualizada exitosamente.");
        setTimeout(() => {
          router.replace("/"); // Redirigir al login
        }, 1000);
      }else {
        // Si no hay campo `result`, mostrar el error que se haya recibido
        showToast("error", response.error || "Ocurrió un error desconocido.");
      }
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Ocurrió un error desconocido.");
    }
  };

  return (
    <View style={globalStyles.screen}>
      <Stack.Screen options={{ title: "Login", headerShown: false }} />
      <StatusBar style="light" />

      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={globalStyles.headerContainer}>
          <Text style={registrerStyles.title}>SACN</Text>
        </View>

        {/* Pestaña Activa */}
        <View style={registrerStyles.tabContainer}>
          <TouchableOpacity style={[registrerStyles.tab, registrerStyles.activeTab]}>
            <Text style={[registrerStyles.tabText, registrerStyles.activeTabText]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>

        {step === "email" && (
          <>
            {/* Campos de entrada */}
            <FormInput
              label="Correo Electrónico"
              value={email}
              onChangeText={setEmail}
              icon={<MaterialCommunityIcons name="email" size={20} color="#666" />}
            />

            <FormInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              icon={<Ionicons name="lock-closed" size={20} color="#666" />}
              iconRight={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              }
            />

            {/* Recuperar contraseña */}
            <TouchableOpacity
              onPress={handleRecoverPasswordButon}
              style={{ alignSelf: "flex-end", marginRight: 20, marginTop: 5 }}
            >
              <Text style={{ color: "#48BBAA", fontWeight: "bold" }}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {/* Botón de login */}
            <View style={registrerStyles.buttonContainer}>
              <Button
                onPress={handleLogin}
                title="Iniciar Sesión"
                backgroundColor="rgb(72, 187, 171)"
                textColor="#000000"
              />
            </View>
          </>
        )}

        {step === "code" && (
          <>
            <FormInput
              label="Código de recuperación"
              value={resetCode}
              onChangeText={setResetCode}
              icon={<Ionicons name="key" size={20} color="#666" />}
            />

            <Button
              onPress={handleVerifyResetCodeButton}
              title="Verificar Código"
              backgroundColor="rgb(72, 187, 171)"
              textColor="#000000"
            />
          </>
        )}

        {step === "resetPassword" && (
          <>
            <FormInput
              label="Nueva Contraseña"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
              icon={<Ionicons name="lock-closed" size={20} color="#666" />}
              iconRight={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              }
            />

            <Button
              onPress={handleResetPasswordButton}
              title="Restablecer Contraseña"
              backgroundColor="rgb(72, 187, 171)"
              textColor="#000000"
            />
          </>
        )}
      </View>

      <Toast />
    </View>
  );
};

export default Login;
