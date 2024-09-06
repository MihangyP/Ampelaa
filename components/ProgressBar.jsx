// components/ProgressBar.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { SIZES } from "../constants";
import { useProgress } from "@/hooks/ProgressContext";

const ProgressBar = () => {
  const { isVisible, text } = useProgress();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const updateProgress = () => {
        setProgress((currentProgress) => {
          if (currentProgress < 99) {
            setTimeout(updateProgress, Math.round(progress * 500));
          }
          return currentProgress + 1;
        });
      };
      updateProgress();
    } else {
      setProgress(0);
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <ActivityIndicator size={40} color={"#FF7575"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.width,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "white",
  },
  text: {
    marginBottom: 10,
    fontSize: 18,
  },
});

export default ProgressBar;
