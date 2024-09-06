import { View, Text } from "react-native";
import React from "react";
import { Slot } from "expo-router";
import { observer } from "@legendapp/state/react";

const _layout = () => {
  return <Slot />;
};

export default observer(_layout);
