import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { Stack, useNavigation } from "expo-router";
import CustomHeader from "@/components/CustomHeader";

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName="index"
    >
      <Stack.Screen
        name="mypost"
        options={{
          tabBarVisibility: "none",
          title: "Mes publication",
          header: () => <CustomHeader title={"Mes publications"} />,
        }}
      />
      <Stack.Screen
        name="oneforum"
        options={{
          tabBarVisibility: "none",
          title: "Mes publication",
          header: () => <CustomHeader title={""} />,
        }}
      />
      <Stack.Screen
        name="addpost"
        options={{
          tabBarVisibility: "none",
          title: "Posez-vous un question",
          header: () => <CustomHeader title={"Posez-vous un question"} />,
        }}
      />
      <Stack.Screen
        name="editpost"
        options={{
          tabBarVisibility: "none",
          title: "Modifier la publication",
          header: () => <CustomHeader title={"Modifier la publication"} />,
        }}
      />
    </Stack>
  );
};

export default _layout;
