import React, { useRef, useEffect, useState } from "react";
import { Modal, View, TouchableWithoutFeedback, Keyboard, Animated, Platform, KeyboardAvoidingView } from "react-native";
import { PanGestureHandler, GestureHandlerRootView } from "react-native-gesture-handler";

interface ModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ visible, onClose, children }) => {
  const translateY = useRef(new Animated.Value(500)).current; // Modal starts from bottom
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
      // Animate modal into view
      Animated.timing(translateY, {
        toValue: 0, // Position at the top of the screen
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      // Animate modal down
      Animated.timing(translateY, {
        toValue: 500, // Move it down out of view
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  },);

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: false }
  );

  const handleGestureEnd = ({ nativeEvent }: any) => {
    if (nativeEvent.translationY > 100) {
      Animated.timing(translateY, {
        toValue: 800, // Slide down
        duration: 200,
        useNativeDriver: false,
      }).start(() => onClose()); // Close after animation
    } else {
      Animated.spring(translateY, {
        toValue: 0, // Reset to top position
        useNativeDriver: false,
      }).start();
    }
  };

  const handleClose = () => {
    if (!keyboardVisible) {
      Animated.timing(translateY, {
        toValue: 800, // Slide down before closing
        duration: 300,
        useNativeDriver: false,
      }).start(() => onClose()); // Close after animation
    } else {
      Keyboard.dismiss(); // Dismiss keyboard if visible
    }
  };

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          {/* Only close modal if clicked outside the modal content */}
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}>
              <PanGestureHandler onGestureEvent={handleGestureEvent} onHandlerStateChange={handleGestureEnd}>
                <Animated.View
                  style={{
                    backgroundColor: "#1E1E1E",
                    padding: 20,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    transform: [{ translateY: translateY }],
                  }}
                >
                  {/* Wrap only the modal content inside the TouchableWithoutFeedback to prevent closing when clicking inside */}
                  <TouchableWithoutFeedback onPress={() => {}} >
                    <View>{children}</View>
                  </TouchableWithoutFeedback>
                </Animated.View>
              </PanGestureHandler>
            </View>
          </TouchableWithoutFeedback>
        </GestureHandlerRootView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalWrapper;
