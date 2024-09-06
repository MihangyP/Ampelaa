import { Pressable, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, SIZES } from "@/constants";
import i18n from "@/constants/i18n";
import { useSelector } from "@legendapp/state/react";
import { preferenceState } from "@/services/AmpelaStates";

const ArticleCategory = ({ active, onPress, children }) => {
  const { theme } = useSelector(() => preferenceState.get());
  const containerStyle = active
    ? [
        styles.container,
        {
          backgroundColor:
            theme === "pink" ? COLORS.accent600 : COLORS.accent800,
          borderColor: theme === "pink" ? COLORS.accent600 : COLORS.accent800,
        },
      ]
    : styles.container;
  const textStyle = active
    ? [styles.text, { color: COLORS.neutral100 }]
    : styles.text;
  let text = null;
  switch (children) {
    case "Menstruations":
      text = "menstruations";
      break;
    case "Hygiène menstruelle":
      text = "hygieneMenstruelle";
      break;
    case "Troubles et maladies":
      text = "troublesEtMaladies";
      break;
    case "Planning Familiale":
      text = "planningFamiliale";
      break;
    case "Astuces":
      text = "astuces";
      break;
    default:
      break;
  }
  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      className={`${active ? "shadow-sm shadow-black " : ""}`}
    >
      <Text style={textStyle}>{i18n.t(text)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, .6)",
    backgroundColor: "rgba(255, 255, 255, .6)",
    height: 30,
  },
  text: {
    fontFamily: "Medium",
    fontSize: SIZES.small,
    color: COLORS.neutral400,
  },
});

export default ArticleCategory;
