import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { Stack, useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS, SIZES } from "@/constants";
import { preferenceState } from "@/services/AmpelaStates";
import { useSelector } from "@legendapp/state/react";
import i18n from "@/constants/i18n";

const _layout = () => {
  const navigation = useNavigation();
  const { theme } = useSelector(() => preferenceState.get());
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: () => (
          <View
            className="w-full flex-row items-center pt-10  pb-3 rounded-b-lg justify-between "
            style={{
              backgroundColor:
                theme === "orange" ? COLORS.accent800 : COLORS.accent500,
              height: SIZES.height * 0.14,
              paddingHorizontal: 16,
            }}
          >
            <View className="flex flex-row items-center justify-center">
              <TouchableOpacity
                className="p-2 pl-0 mr-3 space-y-1"
                onPress={() => navigation.openDrawer()}
              >
                <View className="h-[5] w-7 bg-white rounded-md" />
                <View className="h-[5] w-8 bg-white rounded-md ml-[2px]" />
                <View className="h-[5] w-7 bg-white rounded-md" />
              </TouchableOpacity>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
              >
                 {i18n.t("articles")}
              </Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity
                className="p-2 pl-0 relative"
                onPress={() => navigation.navigate("(message)")}
              >
                <View className="absolute w-2 h-2 bg-[#EEDCAE] rounded-full top-2"></View>
                <Ionicons name="chatbubble" color={"white"} size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2 pl-0 relative"
                onPress={() => navigation.navigate("(message)")}
              >
                <View className="absolute w-2 h-2 bg-[#fedada] rounded-full top-2"></View>
                <Ionicons
                  name="notifications-circle"
                  color={"white"}
                  size={24}
                />
              </TouchableOpacity>
            </View>
          </View>
        ),
      }}
      // initialRouteName="discovery"
    >
      <Stack.Screen
        name="index"
        // options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default _layout;
