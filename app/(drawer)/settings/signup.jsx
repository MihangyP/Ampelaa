import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { COLORS, SIZES } from "@/constants";
import { auth } from "@/services/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useSelector } from "@legendapp/state/react";
import { preferenceState } from "@/services/AmpelaStates";
import i18n from "@/constants/i18n";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomAlert from "@/components/CustomAlert";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const login = ({ closeModal }) => {
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupEmailError, setSignupEmailError] = useState("");
  const [signupPasswordError, setSignupPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [signupErrorPresent, setSignupErrorPresent] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const { theme } = useSelector(() => preferenceState.get());

  const flatListRef = useRef(null);

  const handleSignupEmailChange = (text) => {
    setSignupEmail(text);
    if (!text) {
      setSignupEmailError("Veuillez saisir votre adresse e-mail");
    } else if (!validateEmail(text)) {
      setSignupEmailError("Veuillez saisir une adresse e-mail valide");
    } else {
      setSignupEmailError("");
    }
  };

  const handleSignupPasswordChange = (text) => {
    setSignupPassword(text);
    if (!text) {
      setSignupPasswordError("Veuillez saisir votre mot de passe");
    } else if (!validatePassword(text)) {
      setSignupPasswordError(
        "Le mot de passe doit contenir au moins 8 caractères, inclure au moins une majuscule, une minuscule et un chiffre"
      );
    } else {
      setSignupPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (!text) {
      setConfirmPasswordError("Veuillez confirmer votre mot de passe");
    } else if (text !== signupPassword) {
      setConfirmPasswordError("Les mots de passe ne correspondent pas");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then(async (userCredential) => {
        const { emailVerified } = userCredential.user;

        if (!emailVerified) {
          await sendEmailVerification(userCredential.user).then((response) => {
          });
          handleScrollToIndex(0);
          setSignupEmail("");
          setSignupPassword("");
          setConfirmPassword("");
          setVerificationModalVisible(true);
        }
      })
      .catch((error) => {
        let errorMessage;
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "Adresse e-mail invalide";
            break;
          case "auth/user-disabled":
            errorMessage = "Ce compte a été désactivé";
            break;
          case "auth/network-request-failed":
            errorMessage = "Problème de connexion réseau";
            break;
          case "auth/email-already-in-use":
            errorMessage = "L'adresse e-mail est déjà associée à un compte.";
            break;
          case "auth/weak-password":
            errorMessage =
              "Le mot de passe est trop faible. Veuillez choisir un mot de passe plus fort.";
            break;
          default:
            errorMessage = "Erreur inconnue, veuillez réessayer";
        }
        setSignupError(errorMessage);
        setModalVisible(true);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleScrollToIndex = (index) => {
    flatListRef.current.scrollToIndex({ index });
  };

  useEffect(() => {
    setSignupErrorPresent(
      !signupEmail ||
        !signupPassword ||
        !confirmPassword ||
        signupPasswordError ||
        confirmPasswordError
    );
  }, [
    signupEmail,
    signupPassword,
    confirmPassword,
    signupPasswordError,
    confirmPasswordError,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Text style={styles.closeButtonText}>{i18n.t("ignorer")}</Text>
      </TouchableOpacity>
      <CustomAlert
        type="loading"
        message="Vérification en cours..."
        visible={loading}
        onClose={() => setModalVisible(false)}
        autoClose={false}
      />
      <CustomAlert
        type="error"
        description={signupError}
        visible={isModalVisible && !loading}
        onClose={() => setModalVisible(false)}
        autoClose={true}
      />
      <View className="p-5" style={[]}>
        <Text
          style={[
            styles.confidentialityTitle,
            { color: theme == "pink" ? COLORS.accent500 : COLORS.accent800 },
          ]}
          className="rounded-b-xl pt-20 text-white"
        >
          {i18n.t("inscription")}
        </Text>
        <Text style={styles.infoText}>
            {i18n.t("siVousVoulez")}
        </Text>
      </View>

      <View style={styles.pageContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={i18n.t("adressemail")}
            keyboardType="email-address"
            onChangeText={handleSignupEmailChange}
            editable={!loading}
          />
        </View>
        {signupEmailError && (
          <Text style={styles.errorText}>{signupEmailError}</Text>
        )}
        <View style={[styles.inputContainer, { flexDirection: "row" }]}>
          <TextInput
            style={[styles.input, { width: "90%" }]}
            placeholder={i18n.t("motDePasse")}
            secureTextEntry={isHidden}
            onChangeText={handleSignupPasswordChange}
            editable={!loading}
          />
          <TouchableOpacity
            className="items-center justify-center"
            onPress={() => {
              setIsHidden(!isHidden);
            }}
          >
            <Feather
              name={isHidden ? "eye" : "eye-off"}
              size={20}
              color={"gray"}
            />
          </TouchableOpacity>
        </View>
        {signupPasswordError && (
          <Text style={styles.errorText}>{signupPasswordError}</Text>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={i18n.t("confirmerpassword")}
            secureTextEntry={isHidden}
            onChangeText={handleConfirmPasswordChange}
            editable={!loading}
          />
        </View>
        {confirmPasswordError && (
          <Text style={styles.errorText}>{confirmPasswordError}</Text>
        )}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                signupErrorPresent || loading
                  ? theme === "pink"
                    ? COLORS.accent500_40
                    : COLORS.accent800_40
                  : theme === "pink"
                  ? COLORS.accent500
                  : COLORS.accent800,
              marginTop: 30,
            },
          ]}
          onPress={handleSignUp}
          disabled={signupErrorPresent || loading}
        >
          <Text style={styles.buttonText}>
            {loading ? i18n.t("chargement") : i18n.t("connection")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            {
              borderColor:
                theme === "pink" ? COLORS.accent500 : COLORS.accent800,
            },
          ]}
          onPress={() => router.navigate("settings/login")}
          className="mt-10"
        >
          <Text className="text-center">
            J'ai déja un compte {"  "}
            <Text
              style={[
                styles.switchButtonText,
                {
                  color: theme == "pink" ? COLORS.accent500 : COLORS.accent800,
                },
              ]}
            >
              {i18n.t("connecter")}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral100,
  },
  confidentialityTitle: {
    fontSize: SIZES.width * 0.08,
    fontFamily: "Bold",
  },
  infoText: {
    marginTop: 20,
  },
  pageContainer: {
    padding: 20,
    justifyContent: "center",
    // flex: 2,
    // backgroundColor:COLORS.bg100
  },
  input: {
    padding: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  inputContainer: {
    borderRadius: 5,
    marginVertical: 10,
    width: width - 40,
    backgroundColor: COLORS.bg100,
    borderWidth: 1,
    borderColor: "#c0bdbd",
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    zIndex: 50,
    top: 30,
    justifyContent: "flex-end",
    padding: 15,
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    marginLeft: 10,
  },
  orText: {
    textAlign: "center",
    paddingVertical: 10,
    fontSize: 16,
  },
  switchButton: {
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    marginTop: 0,
    backgroundColor: "white",
  },
  switchButtonText: {
    textAlign: "center",
    fontSize: 14,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    zIndex: 9999,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    color: COLORS.modalTextColor,
  },
  modalButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
  },
  flatListContent: {
    backgroundColor: "white",
  },
});

export default login;
