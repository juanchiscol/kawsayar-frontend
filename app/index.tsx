import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View
} from "react-native";
import Button from "../components/Button";

const { width } = Dimensions.get("window");

const FULL_TITLE = "Kawsayar";
const TYPING_SPEED = 60;
const ANIMATION_DURATION = 1000;
const SPRING_CONFIG = { friction: 4, tension: 50 };

const FEATURES = [
  { icon: "🔬", text: "Análisis preciso", color: "#4BE0C3" },
  { icon: "📊", text: "Historial completo", color: "#2D87E6" },
  { icon: "🏥", text: "Recomendaciones", color: "#FF6B9D" },
];

const Index: React.FC = () => {
  const logoAnimation = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;
  const featuresAnimation = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [typedTitle, setTypedTitle] = useState("");
  const [, setActiveFeature] = useState(0);

  useEffect(() => {
    let index = 0;
    let mounted = true;

    const typeNextChar = () => {
      if (!mounted) return;

      if (index <= FULL_TITLE.length) {
        setTypedTitle(FULL_TITLE.substring(0, index));
        index++;

        if (index <= FULL_TITLE.length) {
          setTimeout(typeNextChar, TYPING_SPEED);
        }
      }
    };

    typeNextChar();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.spring(logoAnimation, {
        toValue: 1,
        ...SPRING_CONFIG,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(featuresAnimation, {
        toValue: 1,
        duration: 600,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeIn, logoAnimation, slideUp, featuresAnimation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % FEATURES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = useCallback(() => {
    router.push("/Login");
  }, [router]);

  const handleRegister = useCallback(() => {
    router.push("/Registrer");
  }, [router]);

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
        <View style={styles.overlay} />
        <View style={styles.gradientOverlay} />

        <Animated.View style={[styles.headerChip, { opacity: fadeIn }]}>
          <Text style={styles.chipLabel}>Kawsayar</Text>
          <View style={styles.dot} />
          <Text style={styles.chipValue}>Detección y monitoreo</Text>
        </Animated.View>

        <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoAnimation }] }]}>
          <Image
            source={require("../assets/images/logo-anemia.png")}
            style={styles.logo}
          />
          <View style={styles.logoBadge}>
            <Text style={styles.badgeText}>Beta</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.textContainer, { transform: [{ translateY: slideUp }] }]}>
          <Text style={styles.title}>{typedTitle}</Text>

          <Text style={styles.description}>
            Captura, recibe alertas y consulta recomendaciones en menos de un minuto.          </Text>
        </Animated.View>


        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>No invasivo</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5s</Text>
            <Text style={styles.statLabel}>Análisis</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Disponible</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            onPress={handleRegister}
            title="Comenzar ahora"
            backgroundColor="rgba(69, 135, 221, 0.57)"
            textColor="rgba(252, 252, 252, 1)"
          />
          <Button
            onPress={handleLogin}
            title="Ya tengo cuenta"
            backgroundColor="rgba(118, 224, 210, 0.53)"
            textColor="rgba(252, 252, 252, 1)"
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
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
    backgroundColor: "rgba(30, 30, 44, 0.85)",
  },
  headerChip: {
    position: "absolute",
    top: 40,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "rgba(30, 70, 115, 0.85)",
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    zIndex: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(100, 180, 255, 0.3)",
  },
  chipLabel: {
    color: "#B8D4FF",
    fontSize: 14,
    letterSpacing: 0.8,
    fontWeight: "700",
  },
  chipValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4BE0C3",
    shadowColor: "#4BE0C3",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  logoContainer: {
    marginTop: 80,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    shadowColor: "#4b87e0ff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  logo: {
    width: width * 0.72,
    height: 120,
    resizeMode: "contain" as const,
  },
  logoBadge: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "rgba(26, 119, 104, 1)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: "#1A7768",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900" as const,
    letterSpacing: 1,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
    zIndex: 2,
    marginTop: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold" as const,
    color: "#FFFFFF",
    textAlign: "center" as const,
    fontFamily: "PlayWrite",
    marginBottom: 8,
    textShadowColor: "rgba(75, 102, 224, 0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
    letterSpacing: 1,
  },
  description: {
    color: "#9DB8D4",
    fontSize: 13,
    textAlign: "center" as const,
    fontWeight: "400" as const,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(30, 70, 115, 0.5)",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(100, 180, 255, 0.3)",
    zIndex: 2,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    color: "#ffffffff",
    fontSize: 24,
    fontWeight: "900" as const,
    marginBottom: 4,
    textShadowColor: "rgba(75, 102, 224, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statLabel: {
    color: "#B8D4FF",
    fontSize: 11,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(184, 212, 255, 0.3)",
    marginHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 28,
    paddingBottom: 45,
    zIndex: 2,
    gap: 14,
  },
});
