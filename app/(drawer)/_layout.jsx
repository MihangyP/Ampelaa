import React, { useState } from "react";
import { COLORS, SIZES, images } from "@/constants";
import i18n from "@/constants/i18n";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import {
  Image,
  SafeAreaView,
  Share,
  Text,
  TouchableOpacity,
  View,
  Modal,
  StatusBar,
} from "react-native";
import { observer, useSelector } from "@legendapp/state/react";
import { AuthContextProvider } from "@/hooks/AuthContext";
import { preferenceState, userState } from "@/services/AmpelaStates";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ModalProvider } from "@/hooks/ModalProvider";
import { auth } from "@/services/firebaseConfig";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import AuthContent from "@/components/AuthContentFromSetting";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DrawerComponent = observer(() => {
  const router = useRouter();
  const { theme } = useSelector(() => preferenceState.get());
  const user = useSelector(() => userState.get());
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAuthModalVisible, setAuthModalVisible] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const scale = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(scale.value, { damping: 10, stiffness: 200 }) },
    ],
  }));

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    scale.value = isModalVisible ? 0 : 1;
  };

  const toggleAuthModal = () => {
    setAuthModalVisible(!isAuthModalVisible);
    scale.value = isAuthModalVisible ? 0 : 1;
  };

  const handleAuth = () =>
    auth.currentUser ? toggleModal() : router.push("settings/login");

  const confirmLogout = () => {
    auth.signOut().then(() => {
      toggleModal();
      toggleAuthModal();
    });
  };

  const urlAmpela = "https://ampela.mg";

  const onShare = async () => {
    try {
      await Share.share({
        message: `Inviter vos amis à utiliser Ampela \n ${urlAmpela}`,
      });
    } catch (error) {}
  };

  const handleItemPress = (item) => {
    setActiveItem(item);
    router.push(item);
  };

  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={theme == "pink" ? COLORS.accent500 : COLORS.accent800}
      />
      <GestureHandlerRootView>
        <ModalProvider>
          <AuthContextProvider>
            <Drawer
              screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor:
                  theme === "orange" ? COLORS.accent800 : COLORS.accent500,
              }}
              drawerContent={(props) => (
                <DrawerContentScrollView
                  {...props}
                  showsVerticalScrollIndicator={false}
                >
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 40,
                      backgroundColor:
                        theme === "pink"
                          ? COLORS.neutral200
                          : COLORS.neutral280,
                      height: SIZES.height * 0.45,
                      marginTop: -40,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleItemPress("settings/account")}
                      style={{ marginTop: 25 }}
                    >
                      <Image
                        source={
                          user.profileImage
                            ? { uri: user.profileImage }
                            : images.avatar
                        }
                        style={{ height: 150, width: 150, borderRadius: 75 }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginTop: 5,
                      }}
                      // className="bg-gray-500"
                    >
                      {user.username || "Utilisateur"}
                    </Text>
                    <Text>{user.email || "Ampela user"}</Text>
                  </View>
                  <Text
                    style={{
                      paddingLeft: 16,
                      marginBottom: 4,
                      marginTop: 20,
                      fontSize: 15,
                      fontWeight: "bold",
                      color: COLORS.text700,
                    }}
                  >
                    {i18n.t("compte")}
                  </Text>
                  <View style={{ paddingLeft: 16 }}>
                    <DrawerItem
                      label={i18n.t("aproposdemoi")}
                      onPress={() => handleItemPress("settings/account")}
                      labelStyle={{
                        color:
                          activeItem === "settings/account"
                            ? "white"
                            : COLORS.text700,
                      }}
                      style={{
                        backgroundColor:
                          activeItem === "settings/account"
                            ? theme === "orange"
                              ? COLORS.accent800
                              : COLORS.accent500
                            : "transparent",
                      }}
                      icon={({ color, size }) => (
                        <AntDesign
                          name="user"
                          color={
                            activeItem === "settings/account"
                              ? "white"
                              : COLORS.text700
                          }
                          size={size}
                        />
                      )}
                    />
                    {!auth.currentUser && (
                      <DrawerItem
                        label={
                          auth.currentUser
                            ? i18n.t("deconnexion")
                            : i18n.t("connecter")
                        }
                        onPress={handleAuth}
                        labelStyle={{ color: COLORS.text700 }}
                        icon={({ color, size }) => (
                          <AntDesign
                            name={auth.currentUser ? "logout" : "login"}
                            color={COLORS.text700}
                            size={size}
                          />
                        )}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      paddingLeft: 16,
                      marginBottom: 4,
                      marginTop: 10,
                      fontSize: 15,
                      fontWeight: "bold",
                      color: COLORS.text700,
                    }}
                  >
                    {i18n.t("general")}
                  </Text>
                  <View style={{ paddingLeft: 16 }} className="">
                    <DrawerItem
                      label={i18n.t("langues")}
                      onPress={() => handleItemPress("settings/changelanguage")}
                      labelStyle={{
                        color:
                          activeItem === "settings/changelanguage"
                            ? "white"
                            : COLORS.text700,
                      }}
                      style={{
                        backgroundColor:
                          activeItem === "settings/changelanguage"
                            ? theme === "orange"
                              ? COLORS.accent800
                              : COLORS.accent500
                            : "transparent",
                      }}
                      icon={({ color, size }) => (
                        <Ionicons
                          name="language"
                          color={
                            activeItem === "settings/changelanguage"
                              ? "white"
                              : COLORS.text700
                          }
                          size={size}
                        />
                      )}
                    />
                    <DrawerItem
                      label={i18n.t("theme")}
                      onPress={() => handleItemPress("settings/changetheme")}
                      labelStyle={{
                        color:
                          activeItem === "settings/changetheme"
                            ? "white"
                            : COLORS.text700,
                      }}
                      style={{
                        backgroundColor:
                          activeItem === "settings/changetheme"
                            ? theme === "orange"
                              ? COLORS.accent800
                              : COLORS.accent500
                            : "transparent",
                      }}
                      icon={({ color, size }) => (
                        <Ionicons
                          name="color-palette-outline"
                          color={
                            activeItem === "settings/changetheme"
                              ? "white"
                              : COLORS.text700
                          }
                          size={size}
                        />
                      )}
                    />
                    <DrawerItem
                      label={i18n.t("faq")}
                      onPress={() => handleItemPress("settings/faq")}
                      labelStyle={{
                        color:
                          activeItem === "settings/faq"
                            ? "white"
                            : COLORS.text700,
                      }}
                      style={{
                        backgroundColor:
                          activeItem === "settings/faq"
                            ? theme === "orange"
                              ? COLORS.accent800
                              : COLORS.accent500
                            : "transparent",
                      }}
                      icon={({ color, size }) => (
                        <Ionicons
                          name="help-circle-outline"
                          color={
                            activeItem === "settings/faq"
                              ? "white"
                              : COLORS.text700
                          }
                          size={size}
                        />
                      )}
                    />
                    <DrawerItem
                      label={i18n.t("infoAmpela")}
                      onPress={() => handleItemPress("settings/aboutampela")}
                      labelStyle={{
                        color:
                          activeItem === "settings/aboutampela"
                            ? "white"
                            : COLORS.text700,
                      }}
                      style={{
                        backgroundColor:
                          activeItem === "settings/aboutampela"
                            ? theme === "orange"
                              ? COLORS.accent800
                              : COLORS.accent500
                            : "transparent",
                      }}
                      icon={({ color, size }) => (
                        <Ionicons
                          name="information-circle-outline"
                          color={
                            activeItem === "settings/aboutampela"
                              ? "white"
                              : COLORS.text700
                          }
                          size={size}
                        />
                      )}
                    />
                    <DrawerItem
                      label={i18n.t("partager")}
                      onPress={onShare}
                      labelStyle={{ color: COLORS.text700 }}
                      icon={({ color, size }) => (
                        <Ionicons
                          name="share-social-outline"
                          color={COLORS.text700}
                          size={size}
                        />
                      )}
                    />
                  </View>
                  <Text
                    style={{
                      paddingLeft: 16,
                      marginBottom: 4,
                      marginTop: 12,
                      fontSize: 15,
                      fontWeight: "bold",
                      color: COLORS.text700,
                    }}
                  >
                    {i18n.t("feedback")}
                  </Text>
                  <View style={{ paddingLeft: 16 }}>
                    <DrawerItem
                      label={i18n.t("envoyerfeedback")}
                      onPress={() => handleItemPress("settings/feedback")}
                      labelStyle={{
                        color:
                          activeItem === "settings/feedback"
                            ? "white"
                            : COLORS.text700,
                      }}
                      style={{
                        backgroundColor:
                          activeItem === "settings/feedback"
                            ? theme === "orange"
                              ? COLORS.accent800
                              : COLORS.accent500
                            : "transparent",
                      }}
                      icon={({ color, size }) => (
                        <Ionicons
                          name="chatbox-ellipses-outline"
                          color={
                            activeItem === "settings/feedback"
                              ? "white"
                              : COLORS.text700
                          }
                          size={size}
                        />
                      )}
                    />
                  </View>
                  <View style={{ height: 20 }} />
                </DrawerContentScrollView>
              )}
            />
          </AuthContextProvider>
        </ModalProvider>
      </GestureHandlerRootView>

      <Modal visible={isModalVisible} onRequestClose={toggleModal} transparent>
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
              animatedStyle,
              { padding: 10, paddingVertical: 20, width: 300 },
            ]}
          >
            <Text style={styles.modalTitle}>Confirmer la déconnexion</Text>
            <Text style={styles.modalMessage}>
              Êtes-vous sûr de vouloir vous déconnecter?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={confirmLogout}
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      theme === "pink" ? COLORS.accent500 : COLORS.accent800,
                  },
                ]}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {i18n.t("oui")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleModal} style={styles.button}>
                <Text style={styles.buttonText}>{i18n.t("non")}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <Modal
        visible={isAuthModalVisible}
        onRequestClose={toggleAuthModal}
        transparent
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Animated.View style={[styles.modalContent, animatedStyle]}>
            <AuthContent closeModal={() => setAuthModalVisible(false)} />
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
});

const styles = {
  modalContent: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalMessage: {
    fontSize: 16,
    marginVertical: 10,
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
};

export default DrawerComponent;
