import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { SIZES, icons } from '@/constants';
const SettingItem = ({ title, urlIcon, routeToNavigate, chevronRight, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={() => navigation.navigate(routeToNavigate)}
    >
      <View style={styles.left}>
        <Image source={urlIcon} style={styles.settingIcon} />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {
       chevronRight ?     
      <View>
        <Image source={icons.chevronRight} style={{ width: 24, height: 24 }} />
      </View> :
       null
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingIcon: {
    width: 20,
    height: 20,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  settingTitle: {
    fontFamily: "Regular",
    fontSize: SIZES.medium,
  },
});

export default SettingItem;
