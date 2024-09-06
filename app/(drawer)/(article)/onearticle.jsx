import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import { COLORS, SIZES } from "@/constants";
import { images } from "@/constants";
import { useNavigationState, useRoute } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import i18n from "@/constants/i18n";

import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { useSelector } from "@legendapp/state/react";
import { preferenceState } from "@/services/AmpelaStates";
import { useEffect } from "react";

const onearticle = () => {
  const route = useRoute();
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const {
    title,
    content,
    list,
    imgInside,
    imgInsideArr,
    imgInsideArrMg,
    content2,
    list2,
    img,
  } = params;
  const { theme } = useSelector(() => preferenceState.get());

  const scrollRef = useAnimatedRef();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-SIZES.height * 0.3, 0, SIZES.height * 0.3],
            [(-SIZES.height * 0.3) / 2, 0, SIZES.height * 0.3 * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-SIZES.height * 0.3, 0, SIZES.height * 0.3],
            [2, 1, 1]
          ),
        },
      ],
    };
  });
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollOffset.value,
        [0, (SIZES.height * 0.2) / 2],
        [0, 1]
      ),
    };
  });

  useEffect(() => {
  }, []);
  const routeName = useNavigationState(
    (state) => state.routes[state.index]?.name
  );

  console.log(imgInsideArr);
  console.log(imgInsideArrMg)
  return (
    <Animated.ScrollView
      ref={scrollRef}
      scrollEventThrottle={16}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
     
      <Animated.View
        style={styles.cover}
      >
        <View style={styles.flex}>
          <View style={{ width: "55%" }}>
            <Text style={[styles.title, { color: "white" }]}>
              {i18n.t(title)}
            </Text>
          </View>
          <View style={{ width: "45%" }}>
            <Animated.Image
              source={img}
              style={[imageAnimatedStyle, { width: 170, height: 170 }]}
              resizeMode="contain"
              sharedTransitionTag={title}
            />
          </View>
        </View>
      </Animated.View>

      <View
        style={{
          padding: 20,
          backgroundColor: "white",
          width: SIZES.width,
        }}
        className="rounded-t-3xl mx-auto"
      >
        {content.split(",").map((c) => (
          <Text key={c} style={[styles.content]}>
            {i18n.t(c)}
          </Text>
        ))}
        <View style={{ gap: 6 }}>
          {list
            ? list.split(",").map((c) => (
                <Text key={c} style={styles.content}>
                  - {i18n.t(c)}
                </Text>
              ))
            : null}
        </View>
      <View style={{ alignItems: "center", gap: 20 }}>
        {/* TO FIX */}
        {/* {i18n.locale === "fr"
          ? imgInsideArr
            ? imgInsideArr.map((img) => (
                <Image
                  key={img}
                  source={img}
                  resizeMode="contain"
                  style={{
                    width: img === images.imgVs1 ? 450 : 500,
                    height: img === images.imgVs1 ? 420 : 500,
                  }}
                  />
                ))
            : null
          : imgInsideArrMg
            ? imgInsideArrMg.map((img) => (
                <Image
                  key={img}
                  source={img}
                  resizeMode="contain"
                  style={{
                    width: img === images.imgVs1 ? 450 : 500,
                    height: img === images.imgVs1 ? 420 : 450,
                  }}
                />
              ))
            : null} */}
        </View>
        {
            title === "lesPhasesDuCycleMenstruel" ?            
            <View style={{ alignItems: "center" }}>
              {imgInside ? (
              <Image
              source={img}
              resizeMode="contain"
              style={{ width: 300, height: 300 }}
              />
          ) : null}
        </View>
            : null
        }
        {content2
          ? content2.split(",").map((c) => (
              <Text key={c} style={styles.content}>
                {i18n.t(c)}
              </Text>
            ))
          : null}
        <View style={{ gap: 6 }}>
          {list2
            ? list2.split(",").map((c) => (
                <Text key={c} style={styles.content}>
                  - {i18n.t(c)}
                </Text>
              ))
            : null}
        </View>
      </View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral280,
  },
  cover: {
    height: SIZES.height * 0.45,
    justifyContent: "flex-end",
    backgroundColor: COLORS.neutral280,
    paddingBottom: 20,
  },
  flex: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  title: {
    fontFamily: "SBold",
    fontSize: SIZES.width * 0.07,
    textAlign: "left",
    marginTop: 15,
    marginLeft: 20,
    color: COLORS.primary,
  },
  content: {
    fontFamily: "Regular",
    fontSize: SIZES.medium,
    lineHeight: 22,
    marginBottom: 10,
  },
});

export default onearticle;
