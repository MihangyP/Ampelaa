import { ImageBackground, KeyboardAvoidingView, Platform } from "react-native";
import { images } from "@/constants";
import { useSelector } from "@legendapp/state/react";
import { preferenceState } from "@/services/AmpelaStates";

const BackgroundContainer = ({
  children,
  paddingBottom,
  paddingHorizontal,
}) => {
  const { theme } = useSelector(() => preferenceState.get());
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ImageBackground
        source={theme === "pink" ? images.bgRose : images.bgOrange}
        resizeMode="repeat"
        style={{
          flex: 1,
          paddingHorizontal: paddingHorizontal ? paddingHorizontal : 20,
          paddingBottom: paddingBottom ? paddingBottom : null,
          // paddingTop: 110,
        }}
      >
        {children}
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default BackgroundContainer;
