import React, { useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  Animated,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "@/constants";
import i18n from "@/constants/i18n";
import { useRouter } from "expo-router";
import { preferenceState } from "@/services/AmpelaStates";
import { useSelector } from "@legendapp/state/react";

const ArticleItem = ({
  title,
  content,
  list,
  imgInside,
  imgInsideArr,
  imgInsideArrMg,
  content2,
  list2,
  img,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { theme } = useSelector(() => preferenceState.get());
  
  const router = useRouter();
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleTextPress = () => {
    router.push({
      pathname: "(drawer)/(article)/onearticle/",
      params: {
        title,
        content,
        list,
        imgInside,
        imgInsideArr,
        imgInsideArrMg,
        content2,
        list2,
        img,
      },
    });
  };

  const handleContainerPress = () => {
    router.push({
      pathname: "(drawer)/(article)/onearticle/",
      params: {
        title,
        content,
        list,
        imgInside,
        imgInsideArr,
        imgInsideArrMg,
        content2,
        list2,
        img,
      },
    });
  };

  return (
    <TouchableOpacity onPress={handleContainerPress} className="shadow-md shadow-black">
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.title}>{i18n.t(title)}</Text>
        <View
          style={[
            styles.category,
            {
              backgroundColor:
                theme === "pink" ? COLORS.accent400 : COLORS.neutral250,
            },
          ]}
          className="w-7"
        >
        </View>
        <View style={styles.img}>
          <Image
            source={img}
            style={{ height: 280, width: 280 }}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.content} numberOfLines={4}>
          {i18n.t(content[0])}
        </Text>
        <Pressable onPress={handleTextPress}>
          <Text
            style={{
              color: theme === "pink" ? COLORS.accent600 : COLORS.accent800,
              fontFamily: "Regular",
              marginTop: 6,
            }}
          >
            Voir plus {">"}
          </Text>
        </Pressable>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    backgroundColor: COLORS.neutral100,
    padding: 15,
    borderRadius: 15,
  },
  title: {
    fontFamily: "SBold",
    fontSize: 20
  },
  category: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 100,
    alignSelf: "flex-start",
    marginVertical: 10,
  },
  content: {
    fontFamily: "Regular",
    lineHeight: 20,
  },
  img: {
    marginVertical: 10,
    height: 300,
    backgroundColor: COLORS.neutral280,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});

export default ArticleItem;
