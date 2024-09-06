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
import { COLORS } from "@/constants";
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
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { useNetInfo } from "@react-native-community/netinfo";
import AuthContent from "@/components/AuthContentFromSetting";
import Myforumitem from "@/components/forum/myforumitem";

const PAGE_SIZE = 10;

const MyPosts = () => {
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
    if (!isConnected || !isInternetReachable) {
      setIsLoading(false);
      return;
    }

    // Set up real-time listener
    const postsQuery = query(
      collection(database, "posts"),
      where("authorId", "==", auth.currentUser.uid),
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
  }, [
    isConnected,
    isInternetReachable,
    auth.currentUser,
    openModal,
    closeModal,
  ]);

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
          where("authorId", "==", auth.currentUser.uid),
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
    [isConnected, isInternetReachable, auth.currentUser, openModal, closeModal]
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
        where("authorId", "==", auth.currentUser.uid),
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
      where("authorId", "==", auth.currentUser.uid),
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
          <View style={{ height: 14 }} />
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
                <View className="flex-row space-x-2 items-center justify-start px-5 mb-5">
                  <TouchableOpacity
                    onPress={() => {
                      router.navigate("(drawer)/(forum)/addpost");
                    }}
                    className="flex-row space-x-2 p-2 bg-white rounded-md shadow-sm shadow-black"
                  >
                    <AntDesign name="edit" size={24} color={COLORS.accent600} />
                    <Text>Poser une question</Text>
                  </TouchableOpacity>
                </View>
              )}

              <FlatList
                data={searchText ? filteredPosts : posts}
                renderItem={({ item }) => (
                  <Myforumitem post={item} navigation={navigation} />
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
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  offlineContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginBottom: 10,
  },
  text: {
    color: "red",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyPosts;
