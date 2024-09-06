import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSelector } from "@legendapp/state/react";
import { getAuth } from "firebase/auth";
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { Image } from "expo-image";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { COLORS, icons, images } from "@/constants";
import i18n from "@/constants/i18n";
import { preferenceState } from "@/services/AmpelaStates";
import { database } from "@/services/firebaseConfig";
import {
  addNewComment,
  getLikeNumber,
  addNewLike,
  removeLike,
  checkUserLikedPost,
  fetchUserDataFromRealtimeDB,
} from "@/services/firestoreAPI";

const PAGE_SIZE = 10;

const OneForum = () => {
  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentValue, setCommentValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [likes, setLikes] = useState(0);
  const [isLikeIconPressed, setIsLikeIconPressed] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const { theme } = useSelector(() => preferenceState.get());
  const params = useLocalSearchParams();
  const { postId, username, onlineImage } = params;
  const router = useRouter();
  const auth = getAuth();
  useEffect(() => {
    if (!auth.currentUser || !postId) return;
    if (!auth.currentUser) {
      setIsDisabled(true);
    }
    const unsubscribe = checkUserLikedPost(
      auth.currentUser.uid,
      postId,
      setIsLikeIconPressed
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [auth.currentUser, postId]);

  useEffect(() => {
    if (!postId) return;

    setLoading(true);
    const postRef = doc(database, "posts", postId);

    const unsubscribePost = onSnapshot(postRef, async (doc) => {
      if (doc.exists()) {
        const postData = doc.data();
        setPostData(postData);
        getLikeNumber(postId, setLikes);
      } else {
      }
      setLoading(false);
    });

    fetchInitialComments();

    return () => {
      unsubscribePost();
    };
  }, [postId]);

  const fetchInitialComments = async () => {
    if (!postId) return;

    const commentsRef = collection(database, "posts", postId, "comments");
    const q = query(
      commentsRef,
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE)
    );
    const snapshot = await getDocs(q);
    const commentsList = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const commentData = doc.data();
        const userData = await fetchUserDataFromRealtimeDB(
          commentData.authorId
        );
        return {
          id: doc.id,
          ...commentData,
          user: userData.user,
        };
      })
    );

    setComments(commentsList);
    setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    setHasMore(snapshot.docs.length === PAGE_SIZE);
  };

  const fetchMoreComments = useCallback(async () => {
    if (!hasMore || !lastVisible || !postId) return;

    const commentsRef = collection(database, "posts", postId, "comments");
    const q = query(
      commentsRef,
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(PAGE_SIZE)
    );

    const snapshot = await getDocs(q);
    const newComments = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const userData = await fetchUserDataFromRealtimeDB(doc.data().authorId);
        return {
          id: doc.id,
          ...doc.data(),
          user: userData.user,
        };
      })
    );

    // Merge new comments with existing comments, avoiding duplicates
    setComments((prevComments) => {
      const existingCommentIds = new Set(
        prevComments.map((comment) => comment.id)
      );
      const uniqueNewComments = newComments.filter(
        (comment) => !existingCommentIds.has(comment.id)
      );
      return [...prevComments, ...uniqueNewComments];
    });

    setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    setHasMore(snapshot.docs.length === PAGE_SIZE);
  }, [postId, lastVisible, hasMore]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (!postId) return;

      const commentsRef = collection(database, "posts", postId, "comments");
      const q = query(
        commentsRef,
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(q);
      const commentsList = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const commentData = doc.data();
          const userData = await fetchUserDataFromRealtimeDB(
            commentData.authorId
          );
          return {
            id: doc.id,
            ...commentData,
            user: userData.user,
          };
        })
      );

      setComments(commentsList);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      
    } finally {
      setRefreshing(false);
    }
  }, [postId]);

  const handleCommentSent = async () => {
    const userId = auth.currentUser?.uid;
    if (commentValue.trim() === "" || !postId || !userId) return;

    const commentData = {
      content: commentValue,
      postId,
      authorId: userId,
      authorName: auth.currentUser.displayName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const response = await addNewComment(commentData);
      if (response?.msg === "no-auth") {
      } else {
        setCommentValue("");
        handleRefresh();
      }
    } catch (error) {
      
    }
  };

  const handleLike = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId || !postData?.postId) return;

    const postId = postData.postId;
    const postRef = doc(database, "posts", postId);
    setIsLikeIconPressed((prev) => !prev);
    setIsDisabled(true);

    try {
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const currentLikes = postDoc.data().like || 0;
        if (isLikeIconPressed) {
          await removeLike(userId, postId);
          await updateDoc(postRef, { like: currentLikes - 1 });
        } else {
          await addNewLike({ userId, postId, createdAt: new Date() });
          await updateDoc(postRef, { like: currentLikes + 1 });
        }
      } else {
        
      }
    } catch (error) {
      
    } finally {
      setIsDisabled(false);
    }
  };

  const formattedDate = (post) =>
    post?.createdAt
      ? new Date(post.createdAt.toDate()).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          weekday: "long",
        })
      : "Date not available";

  const renderComments = () => {
    if (comments.length > 0) {
      return comments.map((comment, id) => (
        <View key={id} style={styles.commentContainer}>
          <View style={styles.commentHeader}>
            <View style={styles.commentAuthor}>
              <Image
                source={{ uri: comment.user?.onlineImage }}
                style={styles.avatar}
              />
              <Text style={styles.username}>{comment.user?.username}</Text>
            </View>
            <Text>
              {new Date(comment.createdAt?.toDate()).toLocaleDateString()}
            </Text>
          </View>
          <Text
            style={[
              styles.author,
              { textAlign: "left", paddingHorizontal: 20 },
            ]}
          >
            {comment.content}
          </Text>
        </View>
      ));
    } else {
      return (
        <View className="items-center justify-center">
          <Text> {i18n.t("aucunCommentaire")}</Text>
        </View>
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  const handleScroll = ({ nativeEvent }) => {
    const paddingToBottom = 20;
    if (
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
      nativeEvent.contentSize.height - paddingToBottom
    ) {
      fetchMoreComments();
    }
  };

  const capitalize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  return (
    <>
      {postData && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View style={styles.header}>
            <View className="flex-row justify-between mb-5">
              <Image
                source={onlineImage ? { uri: onlineImage } : images.avatar}
                style={[styles.avatar, { width: 60, height: 60 }]}
              />
              <View className="flex-col mt-1">
                <Text style={[{ textAlign: "right" }]}>
                  {username || "Anonyme"}
                </Text>
                <Text style={[styles.author, { textAlign: "right" }]}>
                  {formattedDate(postData)}
                </Text>
              </View>
            </View>

            <Text style={styles.title}>{postData.title}</Text>

            <Text style={styles.content}>{postData.description}</Text>

            <View style={styles.interactionContainer}>
              <TouchableOpacity
                style={styles.likeContainer}
                onPress={handleLike}
                disabled={isDisabled}
              >
                <AntDesign
                  name={isLikeIconPressed ? "heart" : "hearto"}
                  size={24}
                  color={COLORS.accent600}
                />
                <Text className="ml-2">{likes}</Text>
              </TouchableOpacity>
              <View style={[styles.interactionItem, styles.ml2]}>
                <Image source={icons.message} style={styles.iconMessage} />
                <Text>{postData.comment}</Text>
              </View>
            </View>
          </View>
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>{capitalize(i18n.t("commentaires"))}</Text>
            {renderComments()}
            {hasMore && (
              <ActivityIndicator
                size="small"
                color="#000000"
                style={styles.loadingMoreIndicator}
              />
            )}
          </View>
        </ScrollView>
      )}
      {auth.currentUser && (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder={i18n.t("ecrireUnCommentaire")}
            value={commentValue}
            onChangeText={setCommentValue}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleCommentSent}
          >
            <Ionicons name="send" size={24} color={COLORS.accent500} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    color: "gray",
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    marginBottom: 24,
  },
  iconMessage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  interactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 5,
  },
  interactionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 1,
    marginTop: 10,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentsSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  commentContainer: {
    marginBottom: 16,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  commentAuthor: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 200,
    marginRight: 8,
  },
  commentText: {
    fontSize: 16,
    paddingHorizontal: 20,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 8,
  },
  loadingMoreIndicator: {
    marginVertical: 16,
  },
});

export default OneForum;
