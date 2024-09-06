import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useSelector } from "@legendapp/state/react";
import { preferenceState, userState } from "@/services/AmpelaStates";
import { COLORS } from "@/constants";
import HeaderWithGoBack from "@/components/header-with-go-back";
import { useNavigation } from "expo-router";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
// Tay
import { AntDesign } from "@expo/vector-icons";

const ChangePassword = () => {
  const { theme } = useSelector(() => preferenceState.get());
  const navigation = useNavigation();
  const user = useSelector(() => userState.get());
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Validate password complexity
  const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  };

  // Handle new password input
  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
    if (!text) {
      setNewPasswordError("Veuillez saisir votre mot de passe");
    } else if (!validatePassword(text)) {
      setNewPasswordError(
        "Le mot de passe doit contenir au moins 8 caractères, inclure au moins une majuscule, une minuscule et un chiffre"
      );
    } else {
      setNewPasswordError("");
    }
  };

  // Handle confirm password input
  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (!text) {
      setConfirmPasswordError("Veuillez confirmer votre mot de passe");
    } else if (text !== newPassword) {
      setConfirmPasswordError("Les mots de passe ne correspondent pas");
    } else {
      setConfirmPasswordError("");
    }
  };

  // Reauthenticate user with current password
  const reauthenticate = (currentPassword) => {
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );
    return reauthenticateWithCredential(currentUser, credential);
  };

  // Handle password change
  const handleChangePassword = () => {
    if (!currentPassword) {
      setCurrentPasswordError("Veuillez saisir votre mot de passe actuel");
      return;
    }
    if (
      newPasswordError ||
      confirmPasswordError ||
      !newPassword ||
      !confirmPassword
    ) {
      Alert.alert("Erreur", "Veuillez corriger les erreurs avant de continuer");
      return;
    }

    reauthenticate(currentPassword)
      .then(() => {
        updatePassword(currentUser, newPassword)
          .then(() => {
            Alert.alert(
              "Succès",
              "Votre mot de passe a été changé avec succès"
            );
            navigation.goBack();
          })
          .catch((error) => {
            Alert.alert(
              "Erreur",
              "Une erreur s'est produite lors du changement de mot de passe"
            );
          });
      })
      .catch((error) => {
        Alert.alert("Erreur", "Le mot de passe actuel est incorrect");
      });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: COLORS.bg100,
      }}
    >
      <HeaderWithGoBack
        title="Changer le mot de passe"
        navigation={navigation}
      />
      <View style={styles.container}>
        <Text style={styles.description}>
          Pour garantir la sécurité de votre compte, veuillez entrer votre mot
          de passe actuel, puis saisir un nouveau mot de passe conforme aux
          exigences de sécurité. Assurez-vous que le nouveau mot de passe
          contient au moins 8 caractères, avec une majuscule, une minuscule et
          un chiffre.
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mot de passe actuel"
            secureTextEntry
            onChangeText={(text) => setCurrentPassword(text)}
          />
        </View>
        {currentPasswordError && (
          <Text style={{ color: "red", textAlign: "left" }}>
            {currentPasswordError}
          </Text>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nouveau mot de passe"
            secureTextEntry
            onChangeText={handleNewPasswordChange}
          />
        </View>
        {newPasswordError && (
          <Text style={{ color: "red", textAlign: "left" }}>
            {newPasswordError}
          </Text>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            secureTextEntry
            onChangeText={handleConfirmPasswordChange}
          />
        </View>
        {confirmPasswordError && (
          <Text
            style={{
              color: "red",
              textAlign: "left",
              paddingLeft: 13,
              alignSelf: "flex-start",
            }}
          >
            {confirmPasswordError}
          </Text>
        )}

        <TouchableOpacity
          disabled={currentPassword === "" || newPassword === ""}
          style={{
            backgroundColor:
              currentPassword === "" || newPassword === ""
                ? theme === "pink"
                  ? COLORS.accent500_40
                  : COLORS.accent800_40
                : theme === "pink"
                ? COLORS.accent500
                : COLORS.accent800,
            width: Math.floor(Dimensions.get("window").width) - 40,
          }}
          onPress={handleChangePassword}
          className="p-3 rounded-md mt-5 flex-row justify-center space-x-2 items-center py-4"
        >
          <Text className="text-white">Modifier le mot de passe</Text>
          {/* <AntDesign name="right" size={20} color="white" className="ml-3" /> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    marginBottom: 20,
    fontSize: 16,
    color: COLORS.dark,
    textAlign: "center",
    lineHeight: 25,
  },
  input: {
    padding: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
  inputContainer: {
    // borderWidth: 1,
    // borderColor: "#c0bdbd",
    borderRadius: 8,
    marginVertical: 10,
    width: Math.floor(Dimensions.get("window").width) - 40,
    backgroundColor: COLORS.bg200,
  },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default ChangePassword;
