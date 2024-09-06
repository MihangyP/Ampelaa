import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderWithGoBack from "@/components/header-with-go-back";
import { router, useNavigation } from "expo-router";

const reminder = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderWithGoBack title={"Rappel"} navigation={navigation} />
    </SafeAreaView>
  );
};

export default reminder;
