import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import SearchArticles from "@/components/article/search-articles";
import { SIZES } from "@/constants";
import ArticleCategory from "@/components/article/article-category";
import ArticleContent from "@/components/article/article-content";
import BackgroundContainer from "@/components/background-container";
import { useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import i18n from "@/constants/i18n";

const DATA = [
  "Menstruations",
  "Hygiène menstruelle",
  "Troubles et maladies",
  "Planning Familiale",
  "Astuces",
];

const ArticlesScreen = () => {
  const [text, setText] = useState("");
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState("Menstruations");
  const handleArticleCategoryPress = useCallback(
    (item) => {
      setActiveCategory(item);
      const index = DATA.findIndex((category) => category === item);

      flatListRef.current.scrollToIndex({ animated: true, index });
    },
    [activeCategory]
  );

  const handleTextInputChange = useCallback((inputText) => {
    setText(inputText);
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container} className="">
        <BackgroundContainer paddingBottom={0}>
       
          <SearchArticles text={text} onChange={handleTextInputChange} />

          <FlatList
            data={DATA}
            style={{ height: 50, marginTop: 5 }}
            renderItem={({ item }) => (
              <ArticleCategory
                onPress={() => handleArticleCategoryPress(item)}
                active={activeCategory === item ? true : false}
              >
                {item}
              </ArticleCategory>
            )}
            horizontal
            ref={flatListRef}
            showsHorizontalScrollIndicator={false}
          />

          <ArticleContent
            navigation={navigation}
            activeCategory={activeCategory}
            text={text}
          />
        </BackgroundContainer>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: "Bold",
    // fontSize: RFValue(SIZES.xLarge),
    fontSize: 22,
    textAlign: "center",
    marginTop: 40,
  },
});

export default ArticlesScreen;
