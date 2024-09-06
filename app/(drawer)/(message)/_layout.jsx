import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { Stack, useNavigation } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { COLORS, SIZES } from "@/constants";
import { preferenceState, userState } from "@/services/AmpelaStates";
import { useSelector } from "@legendapp/state/react";
import { Ionicons } from "@expo/vector-icons";
import i18n from "@/constants/i18n";

const _layout = () => {
  const user = useSelector(() => userState.get());
  const navigation = useNavigation();
  const { theme } = useSelector(() => preferenceState.get());
  return (
    <Stack
      screenOptions={{
        header: () => (
          <View
            className="w-full flex-row items-center   pb-3 rounded-b-lg justify-between absolute "
            style={{
              backgroundColor:
                theme === "orange" ? COLORS.accent800 : COLORS.accent500,
              height: SIZES.height * 0.14,
              paddingHorizontal: 16,
            }}
          >
            <View className="flex flex-row  items-center justify-center pt-10  ">
              <TouchableOpacity
                className="p-2 pl-0 mr-3"
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" color={"white"} size={24} />
              </TouchableOpacity>
            </View>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
              className="pt-10 "
            >
             {i18n.t("message")}
            </Text>
            {/* <TouchableOpacity
              className="p-2 pl-0 "
              onPress={() => navigation.navigate("(message)")}
            >
              <AntDesign name="chatbubble" color={"white"} size={30} />
            </TouchableOpacity> */}
          </View>
        ),

        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName="index"
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="onemessage" options={{ headerShown: false }} />
      <Stack.Screen
        name="profiletarget"
        options={{ headerShown: false}}
      />
    </Stack>
  );
};

export default _layout;
