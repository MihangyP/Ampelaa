import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { COLORS, images, SIZES } from "@/constants";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "@legendapp/state/react";
import { preferenceState } from "@/services/AmpelaStates";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomAlert from "@/components/CustomAlert"; // Assurez-vous que le chemin est correct
import { getAuth, signInWithPhoneNumber } from "firebase/auth";

const OTPScreen = () => {
  const { phoneNumber, confirmation } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false); // Gestion de l'alerte
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();
  const { theme } = useSelector(() => preferenceState.get());

  // Créer des références pour chaque champ OTP
  const otpRefs = useRef([]);
  // otpRefs.focus();

  const handleVerify = async () => {
    if (!confirmation || typeof confirmation.confirm !== 'function') {
      setAlertMessage("Erreur: L'objet confirmation est invalide");
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    setAlertVisible(true); // Afficher l'alerte de chargement
    try {
      await confirmation.confirm(otp);
      setLoading(false);
      setAlertVisible(false); // Masquer l'alerte après le succès
      router.replace("(drawer)"); // Naviguer vers le Drawer
    } catch (error) {
      setLoading(false);
      setAlertVisible(false); // Masquer l'alerte en cas d'erreur
      
      setAlertMessage("Erreur de vérification OTP");
      setAlertVisible(true);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setAlertVisible(true); // Afficher l'alerte de chargement
    try {
      const auth = getAuth();
      const newConfirmation = await signInWithPhoneNumber(auth, phoneNumber);
      router.setParams({ confirmation: newConfirmation });
      setLoading(false);
      setAlertVisible(false); // Masquer l'alerte après le succès
    } catch (error) {
      setLoading(false);
      setAlertVisible(false); // Masquer l'alerte en cas d'erreur
      
      setAlertMessage("Erreur lors de l'envoi du code OTP");
      setAlertVisible(true);
    }
  };

  // Fonction pour gérer le changement de texte dans les champs OTP
  const handleChange = (text, index) => {
    const newOtp = otp.split("");
    newOtp[index] = text;
    setOtp(newOtp.join(""));

    // Si un chiffre est entré, passer au champ suivant
    if (text && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Afficher le CustomAlert pour le chargement */}
      <CustomAlert
        type="loading"
        message="Vérification en cours..."
        visible={loading}
        onClose={() => setAlertVisible(false)}
        autoClose={false}
      />
      <CustomAlert
        type="error"
        message={alertMessage}
        visible={alertVisible && !loading}
        onClose={() => setAlertVisible(false)}
        autoClose={false}
      />
      <View style={styles.topContainer}>
        <Image source={images.otp1} style={styles.image} contentFit="contain" />
        <Text style={styles.title}>Vérifier le Téléphone</Text>
        <Text style={styles.subtitle}>
          Le code a été envoyé à {phoneNumber}
        </Text>
      </View>
      <View style={styles.middleContainer}>
        <View style={styles.otpContainer}>
          {[...Array(6)].map((_, index) => (
            <TextInput
              key={index}
              ref={(el) => (otpRefs.current[index] = el)}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="numeric"
              value={otp[index]}
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: loading
                ? theme === "pink"
                  ? COLORS.accent500_40
                  : COLORS.accent800_40
                : theme === "pink"
                ? COLORS.accent500
                : COLORS.accent800,
            },
          ]}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Chargement..." : "Vérifier"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
          <Text>
            Vous n'avez pas reçu le code OTP ?{" "}
            <Text style={styles.resendText}> RENVOYER LE CODE</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.neutral100,
  },
  topContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  middleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  image: {
    width: SIZES.width - 40,
    height: SIZES.height * 0.3,
    marginBottom: 20,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#c0bdbd",
    borderRadius: 10,
    width: 40,
    height: 40,
    textAlign: "center",
    fontSize: 16,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    width: SIZES.width - 40,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  resendButton: {
    marginTop: 20,
    alignItems: "center",
  },
  resendText: {
    color: COLORS.accent500,
    textDecorationLine: "underline",
  },
});

export default OTPScreen;
