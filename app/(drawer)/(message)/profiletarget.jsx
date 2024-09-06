import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import HeaderWithGoBack from "@/components/header-with-go-back";
import { COLORS, images } from "@/constants";
import { useNavigation } from "expo-router";
import i18n from "@/constants/i18n";

const ProfileTarget = () => {
  const navigation = useNavigation();

  const [profileImage, setProfileImage] = useState(
    "http://example.com/photo.jpg"
  );
  const [username, setUsername] = useState("Dr. Lionely");
  const [specialties, setSpecialties] = useState(["Cardiologie", "Pédiatrie"]);
  const [experience, setExperience] = useState("15 ans");
  const [licenseNumber, setLicenseNumber] = useState("ABC123456");
  const [professionalAffiliations, setProfessionalAffiliations] = useState([
    "Ecole national d'informatique Tulear",
    "Economie DEGS Tulear",
  ]);
  const [practiceLocation, setPracticeLocation] = useState("Anketa ,Tulear");
  const [phoneNumbers, setPhoneNumbers] = useState([
    "+1 234 567 890",
    "+1 987 654 321",
  ]);
  const [emails, setEmails] = useState([
    "doctor@example.com",
    "john.doe@medicalmail.com",
  ]);

  const handlePhonePress = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmailPress = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={styles.container}>
      <HeaderWithGoBack
        title={
          "profile du docteur"
          // i18n.t("aproposdoctor")
        }
        navigation={navigation}
      />
      <ScrollView
        scrollEnabled
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.profileImageContainer}>
            <Image source={images.doctor01} style={styles.profileImage} />
          </TouchableOpacity>
          <Text style={styles.username}>{username}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Spécialités :</Text>
          {specialties.map((specialty, index) => (
            <Text key={index} style={styles.infoValue}>
              {specialty}
            </Text>
          ))}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Expérience :</Text>
          <Text style={styles.infoValue}>{experience}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Numéro de Licence :</Text>
          <Text style={styles.infoValue}>{licenseNumber}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Affiliations Professionnelles :</Text>
          {professionalAffiliations.map((affiliation, index) => (
            <Text key={index} style={styles.infoValue}>
              {affiliation}
            </Text>
          ))}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Lieu de Pratique :</Text>
          <Text style={styles.infoValue}>{practiceLocation}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Numéros de téléphone :</Text>
          {phoneNumbers.map((phoneNumber, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePhonePress(phoneNumber)}
            >
              <Text style={styles.infoValue}>{phoneNumber}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Emails :</Text>
          {emails.map((email, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleEmailPress(email)}
            >
              <Text style={styles.infoValue}>{email}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg100,
    paddingHorizontal: 10,
  },
  scrollView: {
    marginTop: 90,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
    marginTop: 40,
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    position: "relative",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 25,
    padding: 8,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  infoContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  infoLabel: {
    fontSize: 16,
    color: "#6b6b6b",
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    color: COLORS.primary,
  },
});

export default ProfileTarget;
