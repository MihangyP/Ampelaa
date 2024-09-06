import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "@legendapp/state/react";
import { preferenceState } from "@/services/AmpelaStates";

const MenuDraggable = () => {
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get("window");
  const { theme } = useSelector(() => preferenceState.get());
  const left = useSharedValue(width - 190);
  const top = useSharedValue(height - 50);

  const [activeButton, setActiveButton] = useState("calendar");

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.startX = left.value;
      context.startY = top.value;
    },
    onActive: (event, context) => {
      const newX = context.startX + event.translationX;
      const newY = context.startY + event.translationY;
      // 
      if (newX >= insets.left && newX <= width - 165) {
        left.value = newX;
      }
      if (newY >= insets.top && newY <= height - insets.bottom - 60) {
        top.value = newY;
      }
    },
    onEnd: () => {},
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: left.value,
      top: top.value,
    };
  });

  const handlePress = (button) => {
    setActiveButton(button);
    if (button === "calendar") {
      router.navigate("(main)");
    } else if (button === "article") {
      router.navigate("(main)/(article)");
    }
  };

  return (
    <PanGestureHandler onGestureEvent={panGestureHandler}>
      <Animated.View
        style={[animatedStyle, { position: "absolute" }]}
        className="shadow-lg shadow-black bg-white space-x-4 rounded-full p-1 flex-row"
      >
        <TouchableOpacity
          onPress={() => handlePress("calendar")}
          style={[
            styles.button,
            activeButton === "calendar" && {
              backgroundColor:
                theme === "orange" ? COLORS.accent800 : COLORS.accent500,
            },
          ]}
        >
          <Ionicons
            name={"calendar"}
            size={24}
            color={activeButton === "calendar" ? "white" : "#E0E0E0"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handlePress("article")}
          style={[
            styles.button,
            activeButton === "article" && {
              backgroundColor:
                theme === "orange" ? COLORS.accent800 : COLORS.accent500,
            },
          ]}
        >
          <Ionicons
            name={"book"}
            size={24}
            color={activeButton === "article" ? "white" : "#E0E0E0"}
          />
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 60,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
});

export default MenuDraggable;
