import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { COLORS, images, SIZES } from "@/constants";
import { auth, realtimeDatabase, storage } from "@/services/firebaseConfig";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import * as MediaLibrary from "expo-media-library";
import { useSelector } from "@legendapp/state/react";
import {
  preferenceState,
  updateCycleMenstruelData,
  updateUser,
  userState,
} from "@/services/AmpelaStates";
import i18n from "@/constants/i18n";
import { router, useNavigation } from "expo-router";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import CustomAlert from "@/components/CustomAlert";

import { AntDesign, Feather } from "@expo/vector-icons";
import { getAllCycle } from "@/services/database";
import { get, getDatabase, ref, set } from "firebase/database";
import { Image } from "expo-image";
import { getDownloadURL } from "firebase/storage";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginEmailError, setLoginEmailError] = useState("");
  const [loginPasswordError, setLoginPasswordError] = useState("");
  const [loginErrorPresent, setLoginErrorPresent] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { theme } = useSelector(() => preferenceState.get());
  const [loading, setLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const user = useSelector(() => userState.get());
  const handleLoginEmailChange = (text) => {
    setLoginEmail(text);
    if (!text) {
      setLoginEmailError("Veuillez saisir votre adresse e-mail");
    } else if (!validateEmail(text)) {
      setLoginEmailError("Veuillez saisir une adresse e-mail valide");
    } else {
      setLoginEmailError("");
    }
  };

  const handleLoginPasswordChange = (text) => {
    setLoginPassword(text);
    if (!text) {
      setLoginPasswordError("Veuillez saisir votre mot de passe");
    } else {
      setLoginPasswordError("");
    }
  };



  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );

      if (!userCredential.user.emailVerified) {
        await sendEmailVerification(userCredential.user);
        setVerificationModalVisible(true);
        setLoading(false);
        return;
      }

      const userId = userCredential.user.uid;
      const emailFromCredential = userCredential.user.email;

   
      const userDbRef = ref(realtimeDatabase, `users/${userId}/user`);
      const snapshot = await get(userDbRef);

      if (!snapshot.exists()) {
        let profileData = {
          userId: userId,
          username: user.username,
          lastMenstruationDate: user.lastMenstruationDate,
          durationMenstruation: user.durationMenstruation,
          cycleDuration: user.cycleDuration,
          email: loginEmail,
        };

        if (user.profileImage) {
          const blob = await fetchProfileImageBlob(user.profileImage);
          const avatarStorageRef = storageRef(
            storage,
            `Avatar/${user.username}_avatar`
          );
          await uploadBytes(avatarStorageRef, blob);
          const profilePhotoUrl = await getDownloadURL(avatarStorageRef);

          profileData.profileImage = user.profileImage;
          profileData.onlineImage = profilePhotoUrl;
        }

        await set(userDbRef, profileData);

        setLoading(false);
        navigation.goBack();
      } else {
        const data = snapshot.val();

        if (emailFromCredential === user.email) {
          await updateProfile(auth.currentUser, {
            displayName: data.username,
            photoURL: data.onlineImage,
          });

          await updateUser({
            userId: userCredential.user.uid,
            username: user.username,
            lastMenstruationDate: user.lastMenstruationDate,
            durationMenstruation: user.durationMenstruation,
            cycleDuration: user.cycleDuration,
            email: userCredential.user.email,
            profileImage: user.profileImage,
            onlineImage: user.onlineImage,
          });
          const updatedCycles = await getAllCycle();
          updateCycleMenstruelData({ cyclesData: updatedCycles });
        } else {
          await updateUser({
            userId: userCredential.user.uid,
            username: data.username,
            lastMenstruationDate: data.lastMenstruationDate,
            durationMenstruation: data.durationMenstruation,
            cycleDuration: data.cycleDuration,
            email: userCredential.user.email,
            profileImage: data.profileImage,
            onlineImage: data.onlineImage,
          });
          await updateProfile(auth.currentUser, {
            displayName: data.username,
            photoURL: data.onlineImage,
          });

          const updatedCycles = await getAllCycle();
          updateCycleMenstruelData({ cyclesData: updatedCycles });
        }

        navigation.goBack();
      }
    } catch (error) {
      
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to fetch profile image as a blob
  const fetchProfileImageBlob = async (imageUrl) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", imageUrl, true);
      xhr.send(null);
    });
  };

  const handleAuthError = (error) => {
    let errorMessage;
    auth.signOut();
    switch (error.code) {
      case "auth/user-not-found":
        errorMessage = "Adresse e-mail non trouvée";
        break;
      case "auth/invalid-credential":
        errorMessage = "Vérifier vos identifiants et votre mot de passe";
        break;
      case "auth/wrong-password":
        errorMessage = "Mot de passe incorrect";
        break;
      case "auth/invalid-email":
        errorMessage = "Adresse e-mail invalide";
        break;
      case "auth/user-disabled":
        errorMessage = "Ce compte a été désactivé";
        break;
      case "auth/network-request-failed":
        errorMessage = "Problème de connexion réseau";
        break;
      case "auth/too-many-requests":
        errorMessage = "Réessayez plus tard";
        break;
      default:
        errorMessage = "Erreur inconnue, veuillez réessayer";
    }
    setLoginError(errorMessage);
    setModalVisible(true);
  };


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (!loginEmail || !loginPassword) {
      setLoginErrorPresent(true);
    } else {
      setLoginErrorPresent(false);
    }
  }, [loginEmail, loginPassword]);

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
        // message={"Erreur lors de la connexion"}
        description={loginError}
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
          {i18n.t("connecter")}
        </Text>
        <Text style={styles.infoText}>
          Si vous voulez participer au message privée et forum, veuillez vous
          connecter ou créer un compte.
        </Text>
      </View>
      <Image
        source={images.otp1}
        style={{ width: SIZES.width, height: SIZES.height * 0.2 }}
        contentFit="contain"
      />
      <View style={styles.pageContainer}>
        <View style={[styles.inputContainer, { flexDirection: "column" }]}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={handleLoginEmailChange}
          />
        </View>
        {loginEmailError && (
          <Text style={{ color: "red" }}>{loginEmailError}</Text>
        )}
        <View style={[styles.inputContainer]}>
          <TextInput
            style={[styles.input, { width: "90%" }]}
            placeholder="Password"
            secureTextEntry={isHidden}
            onChangeText={handleLoginPasswordChange}
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
        <View className="mt-0 mb-2 flex-row justify-end">
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => {
              setResetEmailSentModalVisible(true);
              handleForgotPassword();
            }}
            className=""
          >
            <Text style={styles.forgotPasswordText}>
              {/* {i18n.t("motDePasseOublie")} */}
              mot de passe oublié ?
            </Text>
          </TouchableOpacity>
        </View>
        {loginPasswordError && (
          <Text style={{ color: "red" }}>{loginPasswordError}</Text>
        )}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                loginErrorPresent || loading
                  ? theme === "pink"
                    ? COLORS.accent500_40
                    : COLORS.accent800_40
                  : theme === "pink"
                  ? COLORS.accent500
                  : COLORS.accent800,
            },
          ]}
          onPress={handleLogin}
          disabled={loginErrorPresent || loading}
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
          onPress={() => navigation.navigate("settings/signup")}
          className="mt-10"
        >
          <Text className="text-center">
            Je suis un nouveau utilisatrice {"  "}
            <Text
              style={[
                styles.switchButtonText,
                {
                  color: theme == "pink" ? COLORS.accent500 : COLORS.accent800,
                },
              ]}
            >
              {i18n.t("inscription")}
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
  pageContainer: {
    padding: 20,
    justifyContent: "center",
    // flex: 2,
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
  infoText: {
    marginTop: 20,
  },
  input: {
    padding: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  switchButtonText: {
    textAlign: "center",
    fontSize: 16,
  },
  inputContainer: {
    borderRadius: 5,
    marginVertical: 10,
    width: SIZES.width - 40,
    backgroundColor: COLORS.bg100,
    borderWidth: 1,
    borderColor: "#c0bdbd",
    flexDirection: "row",
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
  modalContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#FF7575",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
  },

  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#e7e5e5",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.accent600,
    borderRadius: 5,
  },
  orText: {
    textAlign: "center",
    paddingVertical: 10,
  },
  switchButton: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: "white",
  },
  switchButtonText: {
    textAlign: "center",
  },
});

export default Login;
