import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SIZES, COLORS, images } from "@/constants";
import HeaderWithGoBack from "@/components/header-with-go-back";
import { useNavigation } from "expo-router";
import i18n from "@/constants/i18n";
import { preferenceState, updatePreference } from "@/services/AmpelaStates";
import { useSelector } from "@legendapp/state/react";

const ChangeLanguageScreen = () => {
  const navigation = useNavigation();
  const { theme, language } = useSelector(() => preferenceState.get());
  const changeLanguage = async (lang) => {
    try {
      i18n.locale = lang;
      const preferenceData = {
        language: lang,
      };
      updatePreference(preferenceData);
    } catch (error) {
      
    }
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: COLORS.bg100,
          },
        ]}
      >
        <HeaderWithGoBack title={i18n.t("langues")} navigation={navigation} />

        <View style={{ gap: 20, marginTop: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor:
                language === "fr"
                  ? theme === "pink"
                    ? "rgba(226,68,92, .8)"
                    : COLORS.accent800
                  : theme === "pink"
                  ? "rgba(226,68,92, .4)"
                  : COLORS.neutral250,
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
                language === "mg"
                  ? theme === "pink"
                    ? "rgba(226,68,92, .8)"
                    : COLORS.accent800
                  : theme === "pink"
                  ? "rgba(226,68,92, .4)"
                  : COLORS.neutral250,
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
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
    marginTop: 100,
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
});

export default ChangeLanguageScreen;
