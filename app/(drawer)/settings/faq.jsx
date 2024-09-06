import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SIZES, COLORS } from "@/constants";
import HeaderWithGoBack from "@/components/header-with-go-back";
import FaqItem from "@/components/settings/faq-item";
import faqdata from "@/constants/faqdata";
import { useNavigation } from "expo-router";
import i18n from "@/constants/i18n";
import { useSelector } from "@legendapp/state/react";
import { preferenceState } from "@/services/AmpelaStates";

const FaqScreen = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const { theme, language } = useSelector(() => preferenceState.get());
  useEffect(() => {
    setData(faqdata);
  }, []);
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
      <HeaderWithGoBack title="F.A.Q" navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: 100, flex: 1 }}
      >
        {data.map((d) => (
          <FaqItem
            key={d.id}
            question={i18n.t(d.question)}
            response={i18n.t(d.response)}
            list={d.list ? d.list : ""}
          />
        ))}
        <View className="h-[100]" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: COLORS.neutral100,
    justifyContent: "center",
    paddingTop: 40,
  },
  header: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  medium: {
    fontFamily: "Medium",
    fontSize: SIZES.medium,
  },
});

export default FaqScreen;
