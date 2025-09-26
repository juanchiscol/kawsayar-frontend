import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";
import { Stack, useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const Index = () => {
  const logoAnimation = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(20)).current;
  const router = useRouter();
  const fullTitle = "Juntos por la salud de tu hijo";
  const [typedTitle, setTypedTitle] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullTitle.length) {
        const char = fullTitle.charAt(index);
        setTypedTitle(prev => prev + char); // forma correcta
        index++;
      } else {
        clearInterval(interval);
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);



  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoAnimation, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  },);

  const handleLogin = () => router.push("/Login" as any);
  const handleRegister = () => router.push("/Registrer" as any);

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]}>
      <Stack.Screen
        options={{
          title: "Inicio",
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <StatusBar style="light" />

      <ImageBackground
        source={require("../assets/images/anemia-fondo.jpg")}
        blurRadius={4}
        style={styles.backgroundImage}
      >
        {/* Capa oscura para mejor contraste */}
        <View style={styles.overlay} />

        {/* Logo */}
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoAnimation }] }]}>
          <Image
            source={require("../assets/images/logo-anemia.png")}
            style={styles.logo}
          />
        </Animated.View>

        {/* Mensaje central */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {typedTitle}
          </Text>

          <Text style={styles.subtitle}>Prevención y control de la anemia infantil</Text>
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleRegister}
            title="Regístrate gratis"
            backgroundColor="rgba(57, 124, 192, 0.9)"
            textColor="#fff"
          />
          <View style={{ height: 15 }} />
          <Button
            onPress={handleLogin}
            title="Iniciar sesión"
            backgroundColor="rgba(71, 158, 159, 0.9)"
            textColor="rgba(255, 255, 255, 0.9)"
          />
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E2C",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.68)",
  },
  logoContainer: {
    marginTop: 80,
    alignItems: "center",
    zIndex: 2,
  },
  logo: {
    width: width * 0.75,
    height: 120,
    resizeMode: "contain",
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
    zIndex: 2,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    fontFamily: "PlayWrite",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 19,
    color: "#E0E0E0",
    textAlign: "center",
    fontStyle: "italic",

  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 30,
    paddingBottom: 50,
    zIndex: 2,
  },
});
