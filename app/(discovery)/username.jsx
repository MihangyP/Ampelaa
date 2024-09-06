import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { COLORS, FONT, SIZES } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";

import { updateUser } from "@/services/AmpelaStates";
import i18n from "@/constants/i18n";

const UsernameAndPasswordScreen = () => {
  const navigation = useNavigation();

  const [nameText, setNameText] = useState("");
  const [isNextBtnDisabled, setIsNextBtnDisabled] = useState(true);

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (nameText !== "") {
      setIsNextBtnDisabled(false);
    } else {
      setIsNextBtnDisabled(true);
    }
  }, [nameText]);

  const handleUsernameChange = (text) => {
    setNameText(text);
  };

  const handleNextBtnPress = async () => {
    const userData = {
      username: nameText,
      profileImage,
    };
    if (profileImage != null) {
      await MediaLibrary.saveToLibraryAsync(profileImage);
    }
    updateUser(userData);
    navigation.navigate("lastMenstrualCycleStart");
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission refusée",
        "Désolé, nous avons besoin des permissions pour accéder aux images!"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View className="p-5" style={[]}>
        <Text
          style={[styles.confidentialityTitle, { color: COLORS.accent500 }]}
          className="rounded-b-xl pt-20 text-white"
        >
          {/* {i18n.t("connecter")} */}
          Crée un profile
        </Text>
        <Text style={{ marginTop: 20 }}>
            {i18n.t("siVousVoulez")}
        </Text>
      </View>
      <View className=" " style={{ height: SIZES.height * 0.6 }}>
        <View style={styles.inputBoxDeeper}>
          <View style={styles.inputContainer}>
            <TextInput
              cursorColor={COLORS.accent400}
              placeholder="Nom d'utilisateur"
              value={nameText}
              onChangeText={handleUsernameChange}
              style={styles.input}
              className=""
            />
          </View>
        </View>
        <View className="  justify-center items-center">
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.imagePicker}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.image} />
              ) : (
                <>
                  <Text>Photo de profil</Text>
                  <Feather name="camera" size={40} color={COLORS.neutral400} />
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={styles.btnBox}
        className="flex items-center justify-between flex-row p-5"
      >
        <TouchableOpacity
          className="p-3 items-center rounded-md px-5"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-[#8a8888]" style={{ fontSize: FONT.button }}>
            Précédent
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-3 items-center rounded-md px-5 shadow-sm shadow-black"
          onPress={handleNextBtnPress}
          disabled={isNextBtnDisabled}
          style={{
            backgroundColor: isNextBtnDisabled ? "#e7e5e5" : "#FF7575",
          }}
        >
          <Text className="text-white" style={{ fontSize: FONT.button }}>
            Suivant
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
  inputBoxDeeper: {
    marginTop: 70,
    marginLeft: 20,
    gap: 10,
  },
  inputContainer: {
    borderRadius: 5,
    marginVertical: 10,
    width: SIZES.width - 40,
    backgroundColor: COLORS.bg200,
    borderWidth: 1,
    borderColor: "#c0bdbd",
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontFamily: "Medium",
  },
  btnBox: {
    height: SIZES.height * 0.15,
    width: SIZES.width,
  },
  imagePicker: {
    width: SIZES.width * 0.7,
    height: SIZES.width * 0.7,
    borderRadius: SIZES.width * 0.35,
    backgroundColor: "rgb(243 244 246)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c0bdbd",
  },
  image: {
    width: SIZES.width - 70,
    height: SIZES.width - 70,
    borderRadius: 200,
  },
});

export default UsernameAndPasswordScreen;
