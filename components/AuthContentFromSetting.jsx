import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "@legendapp/state/react";
import { preferenceState } from "@/services/AmpelaStates";
import { COLORS } from "@/constants";
import { router } from "expo-router";
import i18n from "@/constants/i18n";

const AuthContentFromSetting = ({ closeModal }) => {
  const { theme } = useSelector(() => preferenceState.get());

  return (
    <View className="min-w-[280] p-5 rounded-md bg-white min-h-[200] items-center ">
      <Ionicons
        name={"information-circle"}
        size={50}
        color={theme === "pink" ? COLORS.accent500 : COLORS.accent800}
      />
      <Text className="my-5">
        {i18n.t("siVousVoulez")}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              backgroundColor:
                theme === "pink" ? COLORS.accent500 : COLORS.accent800,
            },
          ]}
          onPress={() => {
            router.navigate("settings/login");
            closeModal();
          }}
        >
          <Text style={styles.buttonText}>{i18n.t("daccord")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
          <Text style={[styles.buttonText, { color: "black" }]}>{i18n.t("annuler")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default AuthContentFromSetting;
