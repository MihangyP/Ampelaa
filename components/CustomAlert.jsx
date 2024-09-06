import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "@/constants";
import { useSelector } from "@legendapp/state/react";
import { preferenceState } from "@/services/AmpelaStates";

const CustomAlert = ({
  description,
  type = "info",
  message,
  onConfirm,
  onCancel,
  onClose,
  visible,
  autoClose = true,
  autoCloseTime = 3000,
}) => {
  const [opacity] = useState(new Animated.Value(0));
  const { theme } = useSelector(() => preferenceState.get());

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      if (autoClose && type === "info") {
        const timer = setTimeout(() => {
          onClose();
        }, autoCloseTime);
        return () => clearTimeout(timer);
      }
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.alertBox, { opacity }]}>
          <Ionicons
            name={
              type === "confirmation"
                ? "help-circle"
                : type === "loading"
                ? "hourglass-outline"
                : "information-circle"
            }
            size={50}
            color={
              type === "confirmation"
                ? theme === "pink"
                  ? COLORS.accent500
                  : COLORS.accent800
                : theme === "pink"
                ? COLORS.accent500
                : COLORS.accent800
            }
            style={styles.icon}
          />
          {message && <Text style={styles.message}>{message}</Text>}
          <Text style={styles.message}>{description ?? null}</Text>
          {type === "confirmation" && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  {
                    backgroundColor:
                      theme === "pink" ? COLORS.accent500 : COLORS.accent800,
                  },
                ]}
                onPress={onConfirm}
              >
                <Text style={styles.buttonText}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={[styles.buttonText, { color: "black" }]}>
                  Annuler
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {type !== "loading" && type !== "confirmation" && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  {
                    backgroundColor:
                      theme === "pink" ? COLORS.accent500 : COLORS.accent800,
                  },
                ]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: SIZES.width * 0.8,
    padding: 20,
    backgroundColor: COLORS.neutral100,
    borderRadius: 10,
    alignItems: "center",
    elevation: 10,
  },
  icon: {
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmButton: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.accent800,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.bg200,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default CustomAlert;
