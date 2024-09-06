import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "@legendapp/state/react";
import { preferenceState } from "@/services/AmpelaStates";
import { COLORS, SIZES } from "@/constants";
import { router, useNavigation } from "expo-router";

const CustomHeader = ({ title }) => {
  const { theme } = useSelector(() => preferenceState.get());
  const navigation = useNavigation();

  return (
    <View
      className=" w-full flex-row items-center pt-10  rounded-b-lg justify-between  "
      style={{
        backgroundColor:
          theme === "orange" ? COLORS.accent800 : COLORS.accent500,
        height: SIZES.height * 0.14,
        paddingHorizontal: 16,
      }}
    >
      <View className="flex flex-row  items-center justify-center ">
        <TouchableOpacity
          className="p-2 pl-0 mr-3"
          onPress={() => {
            if (router.canDismiss()) {
              router.dismiss();
            }
            navigation.goBack();
          }}
        >
          <Ionicons
            name="arrow-back"
            color={theme === "pink" ? "white" : "white"}
            size={24}
          />
        </TouchableOpacity>
      </View>
      <View className="flex-row">
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
          {title}
        </Text>
        {/* <TouchableOpacity
            className="p-2 pl-0 "
            onPress={() => navigation.replace("(message)")}
          >
            <Ionicons name="chatbubble" color={"white"} size={24} />
          </TouchableOpacity> */}
        {/* <TouchableOpacity
            className="p-2 pl-0 "
            onPress={() => navigation.replace("(message)")}
          >
            <Ionicons
              name="notifications-circle"
              color={"white"}
              size={24}
            />
          </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default CustomHeader;
