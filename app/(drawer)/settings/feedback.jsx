import HeaderWithGoBack from "@/components/header-with-go-back";
import i18n from "@/constants/i18n";
import { useNavigation } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const feedback = () => {
  const navigation = useNavigation();

  const handlePress = (url) => {
    Linking.openURL(url);
  };

  return (
    <>
      <HeaderWithGoBack navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.header}>{i18n.t("textfeedback")}</Text>

        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handlePress("https://www.facebook.com/ampela")}
        >
          <Icon name="facebook" size={24} color="#3b5998" style={styles.icon} />
          <Text style={styles.contactText}>Ampela</Text>
        </TouchableOpacity>
        {/* 
        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handlePress("tel:+261 32 57 153 47")}
        >
          <Icon name="phone" size={24} color="#4CAF50" style={styles.icon} />
          <Text style={styles.contactText}>+261 32 57 153 47</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handlePress("mailto:contact@ampela.com")}
        >
          <Icon name="envelope" size={24} color="#D44638" style={styles.icon} />
          <Text style={styles.contactText}>contact@ampela.com</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handlePress("https://www.ampela.com")}
        >
          <Icon name="globe" size={24} color="#0000EE" style={styles.icon} />
          <Text style={styles.contactText}>Ampela </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 130,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  icon: {
    marginRight: 10,
  },
  contactText: {
    fontSize: 16,
  },
});

export default feedback;
