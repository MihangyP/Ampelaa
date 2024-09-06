import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import HeaderWithGoBack from "@/components/header-with-go-back";
import { SIZES, COLORS, images } from "@/constants";
import { useNavigation } from "expo-router";
import { preferenceState, updatePreference } from "@/services/AmpelaStates";
import { useSelector } from "@legendapp/state/react";
import i18n from "@/constants/i18n";

const ThemeScreen = () => {
  const { theme, language } = useSelector(() => preferenceState.get());
  const navigation = useNavigation();
  const handleThemeChange = (theme) => {
    updatePreference({ theme });
  };
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
          COLORS.bg100
        },
      ]}
      className="space-x-3 "
    >
      <HeaderWithGoBack
        title={i18n.t("theme")}
        navigation={navigation}
        onIconLeftPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={{ alignItems: "center", gap: 10 }}
            onPress={() => handleThemeChange("pink")}
          >
            <Text style={{ fontFamily: "Regular" }}>Anna's Rose</Text>
            <View
              style={{
                padding: 10,
                backgroundColor: theme == "pink" ? COLORS.accent500 : null,
                borderRadius: 10,
              }}
            >
              <Image
                source={images.pinkTheme}
                style={{
                  width: SIZES.width * 0.35,
                  height: 320,
                  borderRadius: 10,
                }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 50,
                borderWidth: 1,
                borderColor:
                  theme === "pink" ? COLORS.accent500 : COLORS.primary,
                backgroundColor:
                  theme === "pink" ? COLORS.accent500 : COLORS.neutral100,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: "center", gap: 10 }}
            onPress={() => handleThemeChange("orange")}
          >
            <Text style={{ fontFamily: "Regular" }}>Linda Sunset</Text>
            <View
              style={{
                padding: 10,
                backgroundColor: theme === "orange" ? COLORS.accent800 : null,
                borderRadius: 10,
              }}
            >
              <Image
                source={images.orangeTheme}
                style={{
                  width: SIZES.width * 0.35,
                  height: 320,
                  borderRadius: 10,
                }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 50,
                borderWidth: 1,
                borderColor:
                  theme === "orange" ? COLORS.accent800 : COLORS.primary,
                backgroundColor:
                  theme === "orange" ? COLORS.accent800 : COLORS.neutral200,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
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
    marginTop: 30,
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
});

export default ThemeScreen;
