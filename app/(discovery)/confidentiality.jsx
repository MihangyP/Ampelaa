import { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import { COLORS, FONT, SIZES } from "@/constants";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "@legendapp/state/react";
import { preferenceState } from "@/services/AmpelaStates";
import i18n from "@/constants/i18n";

const confidentiality = () => {
  const { theme } = useSelector(() => preferenceState.get());

  let bouncyCheckbox1Ref = null;
  let bouncyCheckbox2Ref = null;
  const navigation = useNavigation();

  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [isNextBtnDisabled, setIsNextBtnDisabled] = useState(true);
  const [isScrollEnd, setIsScrollEnd] = useState(false);
  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isEndReached =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    if (isEndReached) {
      setIsScrollEnd(true);
    }
  };

  // useEffect(() => {
  //   const onBackPress = () => {
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     onBackPress
  //   );

  //   navigation.addListener("beforeRemove", (e) => {
  //     e.preventDefault();
  //   });

  //   return () => backHandler.remove();
  // }, [navigation]);

  useEffect(() => {
    if (checkbox2 === true) {
      setIsNextBtnDisabled(false);
    } else {
      setIsNextBtnDisabled(true);
    }
  }, [checkbox1, checkbox2]);

  const flatListRef = useRef(null);
  const handleNextBtnPress = useCallback(() => {
    navigation.navigate("login");
  });

  const prevHandled = () => {
    navigation.goBack();
  };
  const handleAcceptAllBtnPress = useCallback(() => {
    if (checkbox1 === false) {
      bouncyCheckbox1Ref?.onPress();
    }
    if (checkbox2 === false) {
      bouncyCheckbox2Ref?.onPress();
    }
  });

  const confidentialiteData = [
    {
      title: "utilisation",
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia iusto nemo sunt fuga illum rem sit officia recusandae, magni nobis, nostrum expedita libero ut pariatur explicabo harum. Maxime, voluptatibus fugiat  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia iusto nemo sunt fuga illum rem sit officia recusandae, magni nobis, nostrum expedita libero ut pariatur explicabo harum. Maxime, voluptatibus fugiat  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia iusto nemo sunt fuga illum rem sit officia recusandae, magni nobis, nostrum expedita libero ut pariatur explicabo harum. Maxime, voluptatibus fugiat  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia iusto nemo sunt fuga illum rem sit officia recusandae, magni nobis, nostrum expedita libero ut pariatur explicabo harum. Maxime, voluptatibus fugiat  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia iusto nemo sunt fuga illum rem sit officia recusandae, magni nobis, nostrum expedita libero ut pariatur explicabo harum. Maxime, voluptatibus fugiat  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia iusto nemo sunt fuga illum rem sit officia recusandae, magni nobis, nostrum expedita libero ut pariatur explicabo harum. Maxime, voluptatibus fugiat  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia iusto nemo sunt fuga illum rem sit officia recusandae, magni nobis, nostrum expedita libero ut pariatur explicabo harum. Maxime, voluptatibus fugiat",
    },
    {
      title: "utilisation",
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia iusto nemo sunt fuga illum rem sit officia recusandae, magni nobis, nostrum expedita libero ut pariatur explicabo harum. Maxime, voluptatibus fugiat  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia iusto nemo sunt fuga illum rem sit officia recusandae, magni nobis, nostrum expedita libero ut pariatur explicabo harum. Maxime, voluptatibus fugiat  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia iusto nemo sunt fuga illum rem sit officia recusandae, magni nobis, nostrum expedita libero ut pariatur explicabo harum. Maxime, voluptatibus fugiat  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia iusto nemo sunt fuga illum rem sit officia recusandae, magni nobis, nostrum expedita libero ut pariatur explicabo harum. Maxime, voluptatibus fugiat  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia iusto nemo sunt fuga illum rem sit officia recusandae, magni nobis, nostrum expedita libero ut pariatur explicabo harum. Maxime, voluptatibus fugiat  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia iusto nemo sunt fuga illum rem sit officia recusandae, magni nobis, nostrum expedita libero ut pariatur explicabo harum. Maxime, voluptatibus fugiat  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia iusto nemo sunt fuga illum rem sit officia recusandae, magni nobis, nostrum expedita libero ut pariatur explicabo harum. Maxime, voluptatibus fugiat",
    },
  ];

  const renderItem = ({ item }) => (
    <View className="p-3 max-w-[98%]">
      <Text className="font-bold  mb-2" style={{ fontSize: 20 }}>
        {item.title}
      </Text>
      <Text style={{ fontSize: 16, textAlign: "left", lineHeight: 25 }}>
        {item.description}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View className="p-5" style={[]}>
        <Text
          style={[styles.confidentialityTitle, { color: COLORS.accent500 }]}
          className="rounded-b-xl pt-20 text-white"
        >
          {i18n.t("connecter")}
        </Text>
        <Text style={[styles.infoText, { marginTop: 20 }]}>
          {i18n.t("siVousVoulez")}
        </Text>
      </View>
      <View
        style={[styles.confidentialityContainer]}
        className=" flex items-center justify-center p-2"
      >
        <View>
          <View style={styles.confidentialityItem}>
            <FlatList
              data={confidentialiteData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.flatListContent}
              onScroll={handleScroll}
              ref={flatListRef}
            />
            <View className="mt-3 flex-row space-x-3 ml-3">
              <Checkbox
                value={checkbox2 && isScrollEnd}
                onValueChange={setCheckbox2}
                disabled={!isScrollEnd}
                color={checkbox2 && isScrollEnd ? "#FF7575" : ""}
              />
              <Pressable
                onPress={() => {
                  if (isScrollEnd) {
                    setCheckbox2(!checkbox2);
                  }
                }}
              >
                <Text style={styles.confidentialityText}>{i18n.t("daccord")}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      <View
        style={styles.btnBox}
        className="flex items-center  justify-between flex-row  p-5"
      >
        <TouchableOpacity onPress={prevHandled} className="p-3 rounded-md ">
          <Text className="text-[#8a8888]" style={{ fontSize: FONT.button }}>Retour</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-3  items-center rounded-md px-5 shadow-sm shadow-black"
          onPress={handleNextBtnPress}
          disabled={isNextBtnDisabled}
          style={{
            backgroundColor: isNextBtnDisabled ? "#e7e5e5" : "#FF7575",
          }}
        >
          <Text className="text-white" style={{ fontSize: FONT.button }}>
            Suivant
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral100,
  },
  confidentialityContainer: {
    width: SIZES.width,
    height: SIZES.height * 0.6,
  },
  confidentialityTitle: {
    fontSize: SIZES.width * 0.08,
    fontFamily: "Bold",
  },
  confidentialityItem: {
    marginTop: 20,
  },
  confidentialityText: {
    fontFamily: "Regular",
    fontSize: SIZES.width * 0.05,
    lineHeight: 24,
    paddingRight: 20,
  },
  btnBox: {
    height: SIZES.height * 0.15,
    width: SIZES.width,
  },
});

export default confidentiality;
