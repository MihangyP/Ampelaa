import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;
const fontSize = (size) => moderateScale(size, 1);
const number = (n) => moderateScale(n, 1);

const COLORS = {
  primary: "#333333",

  neutral400: "#808080",
  neutral300: "#C4C4C4",
  neutral280: "#FFF2E4",
  neutral250: "#EEDCAE",
  neutral200: "#FEDADA",
  neutral100: "#FFFFFF",

  bg100: "#f3f4f6",
  bg200: "#e5e7eb",
  text100: "#000000",
  text700: "rgba(0,0,0,0.7)",

  accent800: "#FE8729",
  accent800_80: "rgba(254,135,41,0.8)",
  accent800_60: "rgba(254,135,41,0.6)",
  accent800_40: "rgba(254,135,41,0.4)",
  accent800_20: "rgba(254,135,41,0.2)",

  accent600: "#E2445C",
  accent600_80: "rgba(226,68,92,0.8)",
  accent600_60: "rgba(226,68,92,0.6)",
  accent600_40: "rgba(226,68,92,0.4)",
  accent600_20: "rgba(226,68,92,0.2)",

  accent500: "#FF7575",
  accent500_80: "rgba(255,117,117,0.8)",
  accent500_60: "rgba(255,117,117,0.6)",
  accent500_40: "rgba(255,117,117,0.4)",
  accent500_20: "rgba(255,117,117,0.2)",

  accent400: "#FFADAD",
  accent400_80: "rgba(255,173,173,0.8)",
  accent400_60: "rgba(255,173,173,0.6)",
  accent400_40: "rgba(255,173,173,0.4)",
  accent400_20: "rgba(255,173,173,0.2)",
};

const FONT = {
  tiny: fontSize(10),
  xSmall: fontSize(12),
  small: fontSize(14),
  medium: fontSize(16),
  large: fontSize(18),
  xLarge: fontSize(20),
  xxLarge: fontSize(24),
  xxxLarge: fontSize(30),
  huge: fontSize(36),
  xHuge: fontSize(42),
  xxHuge: fontSize(48),
  xxxHuge: fontSize(54),

  title: fontSize(24),
  subtitle: fontSize(20),
  body: fontSize(16),
  caption: fontSize(12),
  button: fontSize(14),
  header: fontSize(18),

  medium: fontSize(16),
  semiBold: fontSize(18),
  bold: fontSize(20),
};

const SIZES = {
  xSmall: scale(10),
  small: scale(13),
  medium: scale(15),
  xmedium: scale(17),
  large: scale(20),
  xLarge: scale(24),
  xxLarge: scale(34),
  height: height,
  width: width,
  fontSize,
  scale,
  verticalScale,
  moderateScale,
  number,
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: verticalScale(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(3.84),
    elevation: scale(2),
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: verticalScale(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(5.84),
    elevation: scale(5),
  },
};

const GLOBAL_STYLES = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.medium,
    backgroundColor: COLORS.bg100,
  },
  titleText: {
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
    color: COLORS.primary,
  },
  shadowStyle: {
    ...SHADOWS.small,
  },
});

export {
  COLORS,
  FONT,
  SIZES,
  SHADOWS,
  GLOBAL_STYLES,
};
