import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { SIZES, data } from "@/constants";
import ArticleItem from "./articleItem";

const showActiveCategoryContent = (activeCategory) => {
  let content = null;
  switch (activeCategory) {
    case "Menstruations":
      content = data[0].content;
      break;
    case "Hygiène menstruelle":
      content = data[1].content;
      break;
    case "Troubles et maladies":
      content = data[2].content;
      break;
    case "Planning Familiale":
      content = data[3].content;
      break;
    case "Astuces":
      content = data[4].content;
      break;
    default:
      
  }
  return content;
};

const ArticleContent = ({ navigation, activeCategory, text }) => {
  const content = showActiveCategoryContent(activeCategory);

  const filteredContent = content.filter((c) =>
    c.title.toLocaleLowerCase().includes(text.toLocaleLowerCase())
  );

  const handleArticleItemPress = (
    title,
    content,
    list,
    imgInside,
    imgInsideArr,
    imgInsideArrMg,
    content2,
    list2,
    img
  ) => {
    navigation.navigate("onearticle", {
      title,
      content,
      list,
      imgInside,
      imgInsideArr,
      imgInsideArrMg,
      content2,
      list2,
      img,
    });
  };

  return (
    <FlatList
      data={filteredContent}
      renderItem={({ item }) => (
        <ArticleItem
          onPress={handleArticleItemPress}
          navigation={navigation}
          title={item.title}
          category={item.category}
          content={item.content}
          list={item.list ? item.list : null}
          imgInside={item.imgInside ? item.imgInside : false}
          imgInsideArr={item.imgInsideArr ? item.imgInsideArr : null}
          imgInsideArrMg={item.imgInsideArrMg ? item.imgInsideArrMg : null}
          content2={item.content2 ? item.content2 : null}
          list2={item.list2 ? item.list2 : null}
          img={item.urlImg}
        />
      )}
      keyExtractor={(item) => item.title}
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{  paddingBottom: 80 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
  },
  title: {
    fontFamily: "Bold",
    fontSize: SIZES.xLarge,
  },
});

export default ArticleContent;
