import {useContext} from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { ThemeContext } from "../hooks/theme-context";
import { COLORS, images, icons } from "@/constants";

const HeaderForum = ({navigation, isDoctor,screen}) => {
  // const {theme} = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.openDrawer()}>
         <Image source={images.user06} style={{ width: 44, height: 44 }} />
      </Pressable>
   
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate(screen)} style={{padding: 10}}>
          <Image
            source={icons.message}
            resizeMode="contain"
            style={{ width: 18, height: 18 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')} style={{padding: 10}}>
          <Image
            source={icons.notification}
            resizeMode="contain"
            style={{ width: 24, height: 24 }}
          />
          <View style={[styles.notificationIndicator, {backgroundColor: "pink" === 'pink' ? COLORS.accent600 : COLORS.accent800}]} />
        </TouchableOpacity>
        {
          isDoctor ?
          <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')} style={{padding: 10}}>
          <Image
            source={icons.seting}
            resizeMode="contain"
            style={{ width: 24, height: 24 }}
          />
         </TouchableOpacity>
         : null
        }  
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notificationIndicator: {
    width: 6,
    height: 6,
    borderRadius: 30,
    position: "absolute",
    right: 14,
    top: 12
  }
});

export default HeaderForum;
