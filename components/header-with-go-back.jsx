import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SIZES, icons, COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "@legendapp/state/react";
import { preferenceState } from "@/services/AmpelaStates";

const HeaderWithGoBack = ({ navigation, title, iconLeft, onIconLeftPress }) => {
  const { theme } = useSelector(() => preferenceState.get());
  return (
    <View
      className=" flex-row items-center  z-50 justify-between  pt-10 pb-3 self-center rounded-b-lg absolute top-0"
      style={{
        backgroundColor: theme === "pink" ? COLORS.accent500 : COLORS.accent800,
        height: SIZES.height * 0.14,
        paddingHorizontal: 16,
        width: SIZES.width,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          // navigation.destroy();
          navigation.goBack();
          navigation.openDrawer();
        }}
        style={{ padding: 10 }}
      >
        <Ionicons
          name="arrow-back"
          color={theme === "pink" ? "white" : "white"}
          size={24}
        />
      </TouchableOpacity>
      <Text
        style={[styles.medium, { color: theme === "pink" ? "white" : "white" }]}
      >
        {title}
      </Text>
      {iconLeft ? (
        <TouchableOpacity className="p-2 pl-0 mr-3" onPress={onIconLeftPress}>
          <Ionicons name="arrow-back" color={"white"} size={35} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  medium: {
    fontFamily: "Regular" ,
    fontSize: 18,
    marginRight: 8,
  },
});

export default HeaderWithGoBack;
