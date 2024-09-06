import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS, SIZES } from "../constants";

export const ResponseOfQuestion0 = ({ text, active, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: active ? COLORS.accent600 : "white",
          borderColor: active ? COLORS.accent600 : null,
        },
      ]}
      onPress={onPress}
      className=" shadow-sm shadow-black"
    >
      <Text style={[styles.text, { color: active ? COLORS.neutral100 : null }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export const ResponseOfQuestion1 = ({ text, active, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: active ? COLORS.accent600 : "white",
          borderColor: active ? COLORS.accent600 : null,
        },
      ]}
      onPress={onPress}
      className=" shadow-sm shadow-black"
    >
      <Text style={[styles.text, { color: active ? COLORS.neutral100 : null }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    height: 40,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  text: {
    fontFamily: "Regular",
    fontSize: SIZES.small,
  },
});
