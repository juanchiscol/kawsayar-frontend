import React from "react";
import { View, Animated, StyleSheet } from "react-native";

interface ProgressBarProps {
  progress: Animated.Value;
  backgroundColor?: string;
  progressColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  backgroundColor = "#E0E0E0",
  progressColor = "rgb(219, 74, 74)",
}) => {
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.progressBarContainer, { backgroundColor }]}>
      <Animated.View
        style={[styles.progressBar, { width: progressWidth, backgroundColor: progressColor }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
});

export default ProgressBar;