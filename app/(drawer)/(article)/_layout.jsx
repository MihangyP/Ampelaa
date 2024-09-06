import { View, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS, SIZES } from "@/constants";
import { useSelector } from "@legendapp/state/react";
import { preferenceState } from "@/services/AmpelaStates";

const _layout = () => {
  const navigation = useNavigation();
  const { theme } = useSelector(() => preferenceState.get());
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: () => (
          <View
            className="w-full flex-row items-center pt-10  pb-3 rounded-b-lg justify-between absolute"
            style={{
              backgroundColor:
                theme === "pink" ? COLORS.accent500 : COLORS.accent800,
              height: SIZES.height * 0.14,
              paddingHorizontal: 16,
            }}
          >
            <View className="flex flex-row  items-center justify-center ">
              <TouchableOpacity
                className="p-2 pl-0 mr-3"
                onPress={() => navigation.goBack()}
              >
                <Ionicons
                  name="arrow-back"
                  color={"white" }
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row"></View>
          </View>
        ),
      }}
    ></Stack>
  );
};

export default _layout;
