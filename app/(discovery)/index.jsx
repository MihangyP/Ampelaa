import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import { SIZES, images, COLORS } from "@/constants";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { updatePreference } from "@/services/AmpelaStates";
import i18n from "@/constants/i18n";
import { FONT, GLOBAL_STYLES } from "@/constants/theme";

const OnBoarding = [
  {
    title: "Bienvenue sur Ampela",
    description:
      "Ampela vous accompagne dans la gestion de votre santé féminine. Suivez vos cycles menstruels, discutez avec des médecins, et accédez à une communauté bienveillante.",
    img: images.abscenceDeRegles,
  },
  {
    title: "Enregistrez vos données",
    description:
      "Gardez une trace de vos cycles, ovulations et rappels de médicaments pour une gestion optimale de votre santé.",
    img: images.culotteMenstruelle,
  },
  {
    title: "Chatter avec les docteurs",
    description:
      "Discutez directement avec des professionnels de la santé pour obtenir des conseils personnalisés.",
    img: images.cycleMenstruel,
  },
  {
    title: "Discuter avec le monde",
    description:
      "Rejoignez notre forum pour échanger avec d'autres femmes et partager vos expériences.",
    img: images.alimentationPendantLesRegles,
  },
];

const index = () => {
  const [currentBoard, setCurrentBoard] = useState(0);
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const preferenceData = { theme: "pink", language: "fr" };
    updatePreference(preferenceData);
  }, []);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageNumber = Math.floor(offsetX / SIZES.width);
    setCurrentBoard(pageNumber);
  };

  const handleNavigation = (route) => {
    navigation.navigate(route);
  };

  const handleNext = () => {
    if (currentBoard < OnBoarding.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: SIZES.width * (currentBoard + 1),
        animated: true,
      });
      setCurrentBoard(currentBoard + 1);
    }
  };

  const handlePrevious = () => {
    if (currentBoard > 0) {
      scrollViewRef.current?.scrollTo({
        x: SIZES.width * (currentBoard - 1),
        animated: true,
      });
      setCurrentBoard(currentBoard - 1);
    }
  };

  const RenderDots = () => (
    <View className="w-full flex items-center flex-row justify-center">
      {OnBoarding.map((_, index) => (
        <View
          key={index}
          className={`${
            currentBoard === index ? "bg-[#FF7575] w-5" : "bg-[#FFADAD] w-2"
          } h-2 rounded-full mx-2`}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View style={{ height: SIZES.height * 0.8 }}>
        <Animated.ScrollView
          horizontal
          pagingEnabled
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          ref={scrollViewRef}
        >
          {OnBoarding.map((item, index) => (
            <View
              key={index}
              style={{ width: SIZES.width }}
              className="bg-white"
            >
              <View
                className="p-4 items-center"
                style={{ height: SIZES.height * 0.45 }}
              >
                <Image
                  source={item.img}
                  contentFit="contain"
                  style={{ width: "80%", height: "100%" }}
                />
              </View>
              <View className="flex items-center justify-center p-5">
                <Text
                  className="font-bold"
                  style={[
                    {
                      color: COLORS.accent600,
                      fontSize: FONT.title,
                      marginBottom: SIZES.number(20),
                    },
                  ]}
                >
                  {item.title}
                </Text>
                <Text
                  className="text-[18px] text-center text-gray-600"
                  style={{ lineHeight: 25, fontSize: FONT.subtitle }}
                >
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </Animated.ScrollView>
        <RenderDots />
      </View>

      <View
        style={{
          justifyContent: currentBoard === 0 ? "flex-end" : "space-between",
          height: SIZES.height * 0.2,
          paddingTop: SIZES.number(55),
        }}
        className="flex-row items-center justify-between w-full p-5"
      >
        {currentBoard > 0 && (
          <TouchableOpacity
            onPress={handlePrevious}
            className="p-3 rounded-md px-6"
          >
            <Text className="text-[#8a8888]" style={{ fontSize: FONT.button }}>
              Retour
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{ backgroundColor: COLORS.accent500 }}
          onPress={
            currentBoard === OnBoarding.length - 1
              ? () => handleNavigation("selectlanguage")
              : handleNext
          }
          className="p-3 rounded-md shadow-sm shadow-black px-6"
        >
          <Text className="text-white" style={{ fontSize: FONT.button }}>
            {currentBoard === OnBoarding.length - 1 ? "Commencer" : "Suivant"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="absolute top-10 right-5">
        <TouchableOpacity onPress={() => handleNavigation("selectlanguage")}>
          <Text
            className="text-[16px] "
            style={{ color: "#424242", fontSize: FONT.button }}
          >
            {i18n.t("ignorer")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default index;
