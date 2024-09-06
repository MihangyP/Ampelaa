import { useState } from "react";
import { Text, View, StyleSheet, Pressable, Image } from "react-native";
import { COLORS, SIZES, icons } from "@/constants";
import i18n from "@/constants/i18n";
import { preferenceState } from "@/services/AmpelaStates";
import { useSelector } from "@legendapp/state/react";

const FaqItem = ({ question, response, list }) => {
  const { theme, language } = useSelector(() => preferenceState.get());
  // const {t} = useTranslation();
  const [active, setActive] = useState(false);

  const handlePress = () => {
    setActive((a) => !a);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.container,
        { backgroundColor: "white", marginVertical: 10 },
      ]}
      className="shadow-sm shadow-black/20"
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <View style={{ width: "90%" }}>
          <Text style={styles.question}>{question}</Text>
        </View>
        <Pressable
          onPress={handlePress}
          style={{
            transform: [{ rotateZ: active ? "180deg" : "0deg" }],
          }}
        >
          <Image source={icons.arrowDown} style={{ width: 20, height: 20 }} />
        </Pressable>
      </View>
      {active ? (
        <View>
          <Text style={styles.response}>{response}</Text>
          {list
            ? list.map((d, index) => (
                <Text key={index} style={styles.response}>
                  - {i18n.t(d)}
                </Text>
              ))
            : null}
        </View>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 8,
  },
  question: {
    fontFamily: "SBold",
    fontSize: SIZES.xmedium,
  },
  response: {
    fontFamily: "Regular",
    fontSize: SIZES.medium,
    marginTop: 10,
    lineHeight: 22,
  },
});

export default FaqItem;
