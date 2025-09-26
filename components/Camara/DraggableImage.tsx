import React from "react";
import { ImageStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

interface DraggableImageProps {
    source: any; // Puedes ajustar el tipo según tu necesidad
    style: ImageStyle;
}

const DraggableImage: React.FC<DraggableImageProps> = ({ source, style }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);
    const scale = useSharedValue(1);
    const scaleOffset = useSharedValue(1);
    const rotation = useSharedValue(0);
    const rotationOffset = useSharedValue(0);


    // Definir los gestos de movimiento (Pan)
    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            const containerWidth = 350; // El ancho del contenedor
            const containerHeight = 400; // La altura del contenedor
            const maxX = 150; // Ancho de la silueta
            const maxY = 150; // Altura de la silueta

            // Calcula los límites del contenedor para el movimiento de la silueta
            const minX = 0;
            const minY = 0;
            const maxTranslateX = containerWidth - maxX; // El límite en X
            const maxTranslateY = containerHeight - maxY; // El límite en Y

            // Actualizar la posición de la silueta, asegurando que no se salga del contenedor
            translateX.value = Math.min(maxTranslateX, Math.max(minX, offsetX.value + event.translationX));
            translateY.value = Math.min(maxTranslateY, Math.max(minY, offsetY.value + event.translationY));
        })
        .onEnd(() => {
            offsetX.value = translateX.value;
            offsetY.value = translateY.value;
        });

    
    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            const containerWidth = 350;
            const containerHeight = 350;
            const maxScale = Math.min(containerWidth / 150, containerHeight / 150);

            scale.value = Math.max(0.5, Math.min(scaleOffset.value * event.scale, maxScale));
        })
        .onEnd(() => {
            scaleOffset.value = scale.value;
        });

    const rotateGesture = Gesture.Rotation()
        .onUpdate((event) => {
            rotation.value = rotationOffset.value + event.rotation;
        })
        .onEnd(() => {
            rotationOffset.value = rotation.value;
        });

    const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture, rotateGesture);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: withSpring(translateX.value) },
            { translateY: withSpring(translateY.value) },
            { scale: withSpring(scale.value) },
            { rotate: withSpring(`${rotation.value}rad`) },
        ],
    }));

    return (
        <GestureDetector gesture={composedGesture}>
            <Animated.Image source={source} style={[style, animatedStyle]} />
        </GestureDetector>
    );
};

export default DraggableImage;