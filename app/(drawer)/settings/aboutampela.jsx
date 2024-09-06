import { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SIZES, COLORS } from "@/constants";
import HeaderWithGoBack from "@/components/header-with-go-back";
import Link from "@/components/navigation/link";
import { useNavigation } from "expo-router";
import i18n from "@/constants/i18n";
import { useSelector } from "@legendapp/state/react";
import { preferenceState } from "@/services/AmpelaStates";

const contentData = [
  {
    subtitle: "calendrierDuCycleMenstruel",
    content: "calendrierDuCycleMenstruelContent",
  },
  {
    subtitle: "articles",
    content: "articleContent",
  },
  {
    subtitle: "forumEtMessagePriveAvecLePersonnelDeSante",
    content: "forumEtMessagePriveAvecLePersonnelDeSanteContent",
  },
  {
    subtitle: "parametresEtPartageDeLapplication",
    content: "parametresEtPartageDeLapplicationContent",
  },
];

const InfoScreen = () => {
  const { theme, language } = useSelector(() => preferenceState.get());
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
          COLORS.bg100
        },
      ]}
    >
      <HeaderWithGoBack title={i18n.t("infoAmpela")} navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={{ marginTop: 10,marginBottom:20 }}>
            <Text style={styles.text}>{i18n.t("introInfo")}</Text>
          </View>

          {contentData.map((content) => {
            return (
              <View key={content.subtitle}>
                <Text style={styles.subtitle}>{i18n.t(content.subtitle)}</Text>
                <Text style={styles.text}>{i18n.t(content.content)}</Text>
              </View>
            );
          })}
        </View>

        <View style={{ marginTop: 30, marginBottom: 15 }}>
          <Text style={styles.text}>
            {i18n.t("partenariat")} : UNFPA Madagascar, Orange Madagascar{" "}
          </Text>
          <Text style={styles.text}>
            {i18n.t("siteWeb")}:{" "}
            <Link url="https://ampela.netlify.app">ampela.netlify.app</Link>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  contentContainer: {
   
    paddingTop: 120,
  },
  text: {
    fontFamily: "Regular",
    fontSize: SIZES.medium,
    lineHeight: 22,
    marginBottom:10
  },
  subtitle: {
    fontFamily: "SBold",
    fontSize: SIZES.large,
    marginVertical:10,
    
  },
});

export default InfoScreen;
