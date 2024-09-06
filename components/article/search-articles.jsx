import {
  View,
  TextInput,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { SIZES, icons } from "@/constants";
import i18n from "@/constants/i18n";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

const SearchArticles = ({text, onChange}) => {
 
  const handleIconRightPress = () => {
    if (text !== "") {
      onChange("");
    }
  };

  return (
    <View style={styles.container} className="shadow-sm shadow-black ">
      <TextInput
        style={{ fontFamily: "Medium", fontSize: SIZES.medium, width: "90%" }}
        placeholder={i18n.t("rechercher")}
        value={text}
        onChangeText={onChange}
      />
      <TouchableOpacity onPress={handleIconRightPress}>
        <AntDesign
          size={20}
          name={text === "" ? "search1" : "close"}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 20,
    backgroundColor: "rgba(255, 255, 255, .8)",
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 44,
  },
});

export default SearchArticles;
