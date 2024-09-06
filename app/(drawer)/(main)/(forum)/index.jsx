import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import ForumItem from "@/components/forum/forum-item";
import { COLORS, SIZES } from "@/constants";
import BackgroundContainer from "@/components/background-container";
import { auth, database } from "@/services/firebaseConfig";
import { Link, router, useNavigation } from "expo-router";
import SearchForum from "@/components/forum/SearchForum";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useModal } from "@/hooks/ModalProvider";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useNetInfo } from "@react-native-community/netinfo";
import AuthContent from "@/components/AuthContentFromSetting";
import i18n from "@/constants/i18n";

const PAGE_SIZE = 10;

const Index = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { openModal, closeModal } = useModal();
  const { isConnected, isInternetReachable } = useNetInfo();

  useEffect(() => {
    // if (!auth.currentUser) {
    //   openModal(<AuthContent closeModal={closeModal} />);
    //   return;
    // }

    if (!isConnected || !isInternetReachable) {
      setIsLoading(false);
      return;
    }

    // Set up real-time listener
    const postsQuery = query(
      collection(database, "posts"),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE)
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Deduplicate posts
      const uniquePosts = Array.from(
        new Map(newPosts.map((post) => [post.id, post])).values()
      );

      setPosts(uniquePosts);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setIsLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [isConnected, isInternetReachable, openModal, closeModal]);

  const searchPosts = useCallback(
    async (searchText) => {
      if (!auth.currentUser) {
        openModal(<AuthContent closeModal={closeModal} />);
        setIsLoading(false);
        return;
      }

      if (!isConnected || !isInternetReachable) {
        setIsLoading(false);
        return;
      }

      try {
        const postsQuery = query(
          collection(database, "posts"),
          where("title", ">=", searchText.toLowerCase()),
          where("title", "<=", searchText.toLowerCase() + "\uf8ff"),
          orderBy("createdAt", "desc"),
          limit(PAGE_SIZE)
        );

        const snapshot = await getDocs(postsQuery);

        if (!snapshot.empty) {
          const newPosts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFilteredPosts(newPosts);
        } else {
          setFilteredPosts([]);
        }
      } catch (error) {
        
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, isInternetReachable, openModal, closeModal]
  );

  const handleSearch = (text) => {
    setSearchText(text);
    searchPosts(text);
  };

  const handleLoadMore = () => {
    if (!isFetchingMore && lastVisible) {
      setIsFetchingMore(true);

      const postsQuery = query(
        collection(database, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(PAGE_SIZE)
      );

      getDocs(postsQuery)
        .then((snapshot) => {
          if (!snapshot.empty) {
            const newPosts = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setPosts((prevPosts) => {
              const allPosts = [...prevPosts, ...newPosts];
              const uniquePosts = Array.from(
                new Map(allPosts.map((post) => [post.id, post])).values()
              );
              return uniquePosts;
            });

            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
          }
          setIsFetchingMore(false);
        })
        .catch((error) => {
          
          setIsFetchingMore(false);
        });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);

    const postsQuery = query(
      collection(database, "posts"),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE)
    );

    // Reset posts and lastVisible to fetch from the beginning
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Deduplicate posts
      const uniquePosts = Array.from(
        new Map(newPosts.map((post) => [post.id, post])).values()
      );

      setPosts(uniquePosts);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setRefreshing(false);
      unsubscribe(); // Cleanup listener after refresh
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        <BackgroundContainer paddingBottom={0} paddingHorizontal={2}>
          <View
            style={{
              paddingBottom: 40,
              paddingHorizontal: 16,
              height: SIZES.height * 0.15,
            }}
          >
            <View style={styles.headerContainer}></View>
          </View>
          <View style={{ height: 8 }} />
          {!isConnected || !isInternetReachable ? (
            <View style={styles.offlineContainer}>
              <MaterialCommunityIcons
                name="wifi-off"
                size={24}
                color="red"
                style={styles.icon}
              />
              <Text style={styles.text}>Hors ligne</Text>
            </View>
          ) : isLoading && posts.length === 0 && filteredPosts.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <>
              <SearchForum onSearch={handleSearch} />
              {auth.currentUser && (
                <View
                  className="flex-row space-x-2 items-center justify-center px-5 mb-5"
                  style={{
                    justifyContent: auth.currentUser ? "center" : "flex-start",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      router.navigate("(drawer)/(forum)/addpost");
                    }}
                    className="flex-row space-x-2 p-2 bg-white rounded-md shadow-sm shadow-black"
                  >
                    <AntDesign name="edit" size={24} color={COLORS.accent600} />
                    <Text>{i18n.t("posezUneQuestion")}</Text>
                  </TouchableOpacity>
                  {auth.currentUser && (
                    <TouchableOpacity
                      onPress={() => {
                        router.navigate("(drawer)/(forum)/mypost");
                      }}
                      className="flex-row space-x-2 p-2 bg-white rounded-md shadow-sm shadow-black"
                    >
                      <AntDesign
                        name="edit"
                        size={24}
                        color={COLORS.accent600}
                      />
                      <Text>{i18n.t("publication")}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              <FlatList
                data={searchText ? filteredPosts : posts}
                renderItem={({ item }) => (
                  <ForumItem post={item} navigation={navigation} />
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                  !isLoading &&
                  !searchText &&
                  posts.length === 0 &&
                  filteredPosts.length === 0 ? (
                    <View style={styles.emptyContainer}>
                      <Text>Pas de données pour le moment</Text>
                    </View>
                  ) : null
                }
                ListFooterComponent={
                  isFetchingMore && posts.length > 0 ? (
                    <View style={{ paddingVertical: 20 }}>
                      <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                  ) : null
                }
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            </>
          )}
        </BackgroundContainer>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: "absolute",
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30001,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
  },
  container: {
    flex: 1,
  },
  offlineContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  icon: {
    marginBottom: 8,
  },
  text: {
    color: "red",
    fontWeight: "bold",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default Index;
