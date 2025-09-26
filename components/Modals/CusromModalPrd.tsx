import React, { useRef, useEffect, useState } from "react";
import { View, TouchableWithoutFeedback, Keyboard, Animated, Platform, KeyboardAvoidingView } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";

interface ModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ visible, onClose, children }) => {
  const translateY = useRef(new Animated.Value(500)).current;
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, );

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const handleGestureEnd = ({ nativeEvent }: any) => {
    if (nativeEvent.translationY > 100) {
      Animated.timing(translateY, {
        toValue: 800,
        duration: 200,
        useNativeDriver: true,
      }).start(() => onClose());
    } else {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleClose = () => {
    if (!keyboardVisible) {
      Animated.timing(translateY, {
        toValue: 800,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onClose());
    } else {
      Keyboard.dismiss();
    }
  };

  if (!visible) return null; // No renders if not visible

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <PanGestureHandler onGestureEvent={handleGestureEvent} onHandlerStateChange={handleGestureEnd}>
            <Animated.View
              style={{
                backgroundColor: "#1E1E1E",
                padding: 20,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                transform: [{ translateY }],
              }}
            >
              <TouchableWithoutFeedback onPress={() => {}}>
                <View>{children}</View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ModalWrapper;
