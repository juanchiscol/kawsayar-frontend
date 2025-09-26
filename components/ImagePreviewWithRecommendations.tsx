import React, { forwardRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DraggableImage from "@/components/Camara/DraggableImage";
import { predictionStyles } from "@/styles/prediction-styles";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import Button from "@/components/Button";

interface ImagePreviewWithRecommendationsProps {
  selectedImage: string;
  silhouetteImage: any;
  onPress: () => void;
}

const ImagePreviewWithRecommendations = forwardRef<
  View,
  ImagePreviewWithRecommendationsProps
>(({ selectedImage, silhouetteImage, onPress }, ref) => {
  const [enabled, setEnabled] = useState(true);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(1);
  const scaleOffset = useSharedValue(1);

  const containerWidth = 200;
  const containerHeight = 200;
  const imageWidth = 200;
  const imageHeight = 200;
  const minScale = 1;
  const maxScale = 8; // Puedes ajustar este valor si quieres más zoom

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const scaledWidth = imageWidth * scale.value;
      const scaledHeight = imageHeight * scale.value;

      const maxTranslateX = Math.max(0, (scaledWidth - containerWidth) / 2);
      const maxTranslateY = Math.max(0, (scaledHeight - containerHeight) / 2);

      const newX = offsetX.value + event.translationX;
      const newY = offsetY.value + event.translationY;

      translateX.value = Math.max(-maxTranslateX, Math.min(maxTranslateX, newX));
      translateY.value = Math.max(-maxTranslateY, Math.min(maxTranslateY, newY));
    })
    .onEnd(() => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      let nextScale = scaleOffset.value * event.scale;
      nextScale = Math.max(minScale, Math.min(nextScale, maxScale));
      scale.value = nextScale;
    })
    .onEnd(() => {
      scaleOffset.value = scale.value;
    });


  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));


  return (
    <>
      <TouchableOpacity
        style={[
          predictionStyles.toggleButton,
          enabled ? {} : predictionStyles.disabledButton,
        ]}
        onPress={() => setEnabled((prev) => !prev)}
      >
        <Text style={predictionStyles.toggleButtonText}>
          {enabled ? "Ocultar silueta guía 👁️" : "Mostrar silueta guía 👁️"}
        </Text>
      </TouchableOpacity>

      <View style={predictionStyles.imageContainer} ref={ref}>
        <GestureDetector gesture={composedGesture}>
          <Animated.Image
            source={{ uri: selectedImage }}
            style={[predictionStyles.capturedImage, animatedStyle]}
          />
        </GestureDetector>
        {enabled && (
          <DraggableImage
            source={silhouetteImage}
            style={predictionStyles.silhouetteImage}
          />
        )}
      </View>

      <View style={predictionStyles.recommendationBox}>
        <Text style={predictionStyles.recommendationEmoji}>💡</Text>
        <Text style={predictionStyles.recommendationText}>
          <Text style={predictionStyles.bold}>Recomendaciones:{"\n"}</Text>
          Coloca la imagen de la {" "}
          <Text style={predictionStyles.highlight}>conjuntiva</Text> en la silueta.
          {"\n"}
          La imagen no debe estar muy lejos ni muy cerca{" "}
          {"\n"}
          Si está muy <Text style={predictionStyles.highlight}>alejada</Text>, puedes {" "}
          <Text style={predictionStyles.highlight}>acercarla o alejarla</Text> con un gesto de pellizco.
        </Text>
      </View>

      <Button
        onPress={onPress}
        title="Confirmar la imagen"
        backgroundColor={enabled ? "rgb(72, 187, 171)" : "#ccc"}
        textColor="#000000"
        disabled={!enabled}
      />
    </>
  );
});

ImagePreviewWithRecommendations.displayName = "ImagePreviewWithRecommendations";

export default ImagePreviewWithRecommendations;
