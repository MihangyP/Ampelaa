import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
} from "react-native";
import HeaderWithGoBack from "@/components/header-with-go-back";
import { COLORS, SIZES, images } from "@/constants";
import { useNavigation } from "expo-router";
import {
  preferenceState,
  updateUser,
  userState,
} from "@/services/AmpelaStates";
import { useSelector } from "@legendapp/state/react";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { updateUserSqlite } from "@/services/database";
import { getAuth } from "firebase/auth";
import { auth } from "@/services/firebaseConfig";
import i18n from "@/constants/i18n";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AccountScreen = () => {
  const { theme } = useSelector(() => preferenceState.get());
  const user = useSelector(() => userState.get());
  const [username, setUsername] = useState(user.username);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profileImage1, setProfileImage] = useState(user.profileImage);
  const navigation = useNavigation();
  const scale = useSharedValue(0);
 
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    scale.value = isModalVisible ? 0 : 1;
  };

  const handleEditPress = async () => {
    setIsModalVisible(true);
  };
  const handleSave = async () => {
    try {
      // Utiliser updateUser pour mettre à jour l'utilisateur
      await updateUser({ username });
      setIsModalVisible(false);
    } catch (error) {
      
    }
  };

  const handleProfileImageChange = async () => {
    try {
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
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const profileImage = result.assets[0].uri;
        await MediaLibrary.saveToLibraryAsync(profileImage);
        await updateUser({ profileImage });
        setProfileImage(profileImage);
      }
    } catch (error) {
      
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.neutral100,
        justifyContent: "center",
      }}
    >
      <HeaderWithGoBack
        title={i18n.t("aproposdemoi")}
        navigation={navigation}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[
          styles.container,
          {
            backgroundColor: COLORS.bg100,
          },
        ]}
      >
        <View style={styles.profil}>
          <TouchableOpacity
            className=" w-[150] h-[150] rounded-full relative"
            onPress={handleProfileImageChange}
          >
            <Image
              source={profileImage1 ? { uri: profileImage1 } : images.avatar}
              style={{ height: 150, width: 150, borderRadius: 150 }}
            />

            <AntDesign
              name="camera"
              size={30}
              style={{
                display: "absolute",
                top: -50,
                right: -90,
                backgroundColor: "white",
                borderRadius: 100,
                padding: 10,
                width: 50,
              }}
              color={theme == "pink" ? COLORS.accent600 : COLORS.accent800}
            />
          </TouchableOpacity>
          <View className="p-2 flex-row space-x-3 mt-1">
            <Text style={styles.username}>{user.username}</Text>
            <TouchableOpacity onPress={() => handleEditPress()}>
              <AntDesign
                name="edit"
                size={24}
                color={theme == "pink" ? COLORS.accent600 : COLORS.accent800}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className=" py-5 ">
          <View className="" style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Durée du cycle :</Text>
            <Text className="font-bold text-[16px]">
              {user.cycleDuration} jours
            </Text>
          </View>
          <View className="" style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Durée des règles :</Text>
            <Text className="font-bold text-[16px]">
              {user.durationMenstruation} jours
            </Text>
          </View>
          <View className="" style={styles.infoContainer}>
            <Text style={styles.infoLabel}>
              Premier jour du dernier cycle :
            </Text>
            <Text className="font-bold text-[16px]">
              {user.lastMenstruationDate}
            </Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("settings/updatecycleinfo");
            }}
            style={styles.infoContainer} 
          >
            <Text style={styles.infoLabel}>
              Modifier les informations du cycle
            </Text>
            <AntDesign
              name="right"
              size={18}
              color="black"
              style={styles.icon}
            />
          </TouchableOpacity>

          {auth.currentUser && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("settings/changepassword");
              }}
              style={[styles.infoContainer, styles.mt10]} 
            >
              <Text style={styles.infoLabel}>Changer mon mot de passe</Text>
              <AntDesign
                name="right"
                size={18}
                color="black"
                style={styles.icon}
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <Animated.View
            style={[
              styles.modalContent,
              // animatedStyle,
              { padding: 10, paddingVertical: 20, width: 300 },
            ]}
          >
            <Text className="text-[16px] my-2" style={{ marginBottom: 10 }}>
              {i18n.t("changernom")}
            </Text>

            <View
              style={{
                backgroundColor: COLORS.bg200,
                borderRadius: 8,
                paddingHorizontal: 10,
                fontSize: 16,
                width: 255,
                marginBottom: 10,
              }}
            >
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                }}
                keyboardType={"default"}
                placeholder={"Rakotazafy .."}
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleSave}
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      theme === "pink" ? COLORS.accent500 : COLORS.accent800,
                  },
                ]}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {i18n.t("enregistrer")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleModal} style={styles.button}>
                <Text style={styles.buttonText}>{i18n.t("annuler")}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 140,
  },
  profil: {
    alignItems: "center",
    gap: 15,
    paddingVertical: 30,
  },
  uploadImgText: {
    fontFamily: "Regular",
    fontSize: SIZES.small,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  infoLabel: {
    fontSize: 16,
    color: "#6b6b6b",
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  uploadImg: {
    width: 20,
    height: 20,
  },
  infoContainer: {
    paddingHorizontal: 5,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
  },
  input: {
    padding: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#c0bdbd",
    borderRadius: 15,
    marginVertical: 10,
    width: 260,
    backgroundColor: "rgb(243 244 246)",
  },
  saveBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 100,
    alignSelf: "flex-end",
  },
  title: {
    fontFamily: "SBold",
    fontSize: SIZES.xLarge,
    marginBottom: 15,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#d1d5db",
    borderRadius: 4,
    minWidth: 60,
  },
  buttonText: {
    color: "#111827",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AccountScreen;
