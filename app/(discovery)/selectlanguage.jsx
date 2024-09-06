import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SIZES, COLORS, images, FONT } from "@/constants";
import HeaderWithGoBack from "@/components/header-with-go-back";
import { useNavigation } from "expo-router";
import i18n from "@/constants/i18n";
import { preferenceState, updatePreference } from "@/services/AmpelaStates";
import { useSelector } from "@legendapp/state/react";
import { useCallback } from "react";
import { Image } from "expo-image";

const selectlanguage = () => {
  const navigation = useNavigation();
  const { theme, language } = useSelector(() => preferenceState.get());
  const changeLanguage = async (lang) => {
    try {
      i18n.locale = lang;
      const preferenceData = {
        language: lang,
      };
      await updatePreference(preferenceData);
    } catch (error) {}
  };

  const handleNextBtnPress = useCallback(() => {
    navigation.navigate("confidentiality");
  });

  return (
    <>
      <View style={[styles.container, {}]}>
        <View className="p-5" style={[]}>
          <Text
            style={[styles.confidentialityTitle, { color: COLORS.accent500 }]}
            className="rounded-b-xl pt-20 text-white"
          >
            {i18n.t("connecter")}
          </Text>
          <Text style={styles.infoText}>
            Si vous voulez participer au message privée et forum, veuillez vous
            connecter ou créer un compte.
          </Text>
        </View>
        <View className=" p-10 flex-1  pt-20 space-y-8">
          <TouchableOpacity
            style={{
              backgroundColor:
                language === "fr" ? "#FF7575" : "rgba(255,117,117,.4)",
              borderRadius: 5,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              padding: 10,
            }}
            onPress={() => changeLanguage("fr")}
          >
            <Text style={{ color: COLORS.neutral100, fontFamily: "SBold" }}>
              Français
            </Text>
            <Image
              source={images.franceImg}
              style={{ width: 30, height: 20, borderRadius: 5 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor:
                language === "mg" ? "#FF7575" : "rgba(255,117,117,.4)",
              borderRadius: 5,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              padding: 10,
            }}
            onPress={() => changeLanguage("mg")}
          >
            <Text style={{ color: COLORS.neutral100, fontFamily: "SBold" }}>
              Malagasy
            </Text>
            <Image
              source={images.madaImg}
              style={{ width: 30, height: 20, borderRadius: 5 }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={styles.btnBox}
          className="flex items-center  justify-end flex-row  p-5"
        >
          <TouchableOpacity
            className="p-3  items-center rounded-md px-5 shadow-sm shadow-black"
            onPress={handleNextBtnPress}
            style={{
              backgroundColor: "#FF7575",
            }}
          >
            <Text className="text-white" style={{ fontSize: FONT.button }}>
              Suivant
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral100,
  },
  header: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  medium: {
    fontFamily: "Medium",
    fontSize: SIZES.medium,
  },
  content: {
    marginTop: 20,
  },
  infoText: {
    marginTop: 20,
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  confidentialityContainer: {
    width: SIZES.width,
    height: SIZES.height * 0.6,
  },
  confidentialityTitle: {
    fontSize: SIZES.width * 0.08,
    fontFamily: "Bold",
    // height: SIZES.height * 0.3,
    // width: SIZES.width + 156,
  },
  confidentialityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 20,
  },
  confidentialityText: {
    fontFamily: "Regular",
    fontSize: SIZES.width * 0.05,
    lineHeight: 24,
    paddingRight: 20,
  },
  btnBox: {
    height: SIZES.height * 0.15,
    width: SIZES.width,
  },
});

export default selectlanguage;
