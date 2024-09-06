import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { COLORS, SIZES, icons, images } from "@/constants";
import {
  addNewComment,
  addNewLike,
  removeLike,
  getLikeNumber,
  getCommentNumber,
  checkUserLikedPost,
  fetchUserDataFromRealtimeDB,
} from "@/services/firestoreAPI";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import i18n from "@/constants/i18n";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { database } from "@/services/firebaseConfig";

const truncateText = (text, maxLength) => {
  if (!text || typeof text !== "string") return "";
  return text.length <= maxLength
    ? text
    : text.substring(0, maxLength - 3) + "...";
};

const ForumItem = ({ post, refToCommentItem }) => {
  const [isLikeIconPressed, setIsLikeIconPressed] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const [userPosteur, setUserPosteur] = useState();

  useEffect(() => {
    if (!post?.postId) return;
    // if (!auth.currentUser) {
    //   setIsDisabled(true);
    // }
    
    const fetchUser = async () => {
      try {
        const userData = await fetchUserDataFromRealtimeDB(post?.authorId);
        
        setUserPosteur(userData?.user);
      } catch (error) {
        
      }
    };

    const unsubscribeLikes = getLikeNumber(post.postId, setLikeCount);
    const unsubscribeComments = getCommentNumber(post.postId, setCommentCount);

    fetchUser();

    // return () => {
    //   // Cleanup
    //   if (unsubscribeLikes) unsubscribeLikes();
    //   if (unsubscribeComments) unsubscribeComments();
    // };
  }, [post?.postId]);

  useEffect(() => {
    if (!userId || !post?.postId) return;

    const unsubscribe = checkUserLikedPost(
      userId,
      post.postId,
      setIsLikeIconPressed
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId, post?.postId]);

  const handleLikeIconPress = async () => {
    if (!userId || !post?.postId) return;

    const postId = post.postId;
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

  const handleCommentSent = async () => {
    if (!commentValue.trim() || !post?.postId || !userId) return;

    setIsSubmitting(true);
    const commentData = {
      content: commentValue,
      postId: post.postId,
      authorId: userId,
      // authorName: auth.currentUser.displayName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const response = await addNewComment(commentData);
      if (response && response.msg === "no-auth") {
        
      } else {
        
        setCommentValue("");

        // const postRef = doc(database, "posts", post.postId);
        // await updateDoc(postRef, {
        //   comment: increment(1)
        // });
      }
    } catch (error) {
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = post?.createdAt
    ? new Date(post.createdAt.toDate()).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
      })
    : "Date not available";

  return (
    userPosteur && (
      <TouchableOpacity
        onPress={() =>
          router.navigate({
            pathname: "(drawer)/(forum)/oneforum",
            params: { postId: post.postId, ...userPosteur },
          })
        }
        style={styles.container}
        className={`shadow-sm shadow-black `}
      >
        <View style={styles.header}>
          <Image
            source={{ uri: userPosteur?.onlineImage }}
            style={styles.avatar}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.authorName}>
              {userPosteur?.username || "Anonymous"}
            </Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            {post?.title || "Title not available"}
          </Text>
          <Text style={styles.body}>
            {truncateText(post.description || "Content not available", 500)}
          </Text>
        </View>

        <View style={styles.reactions}>
          <View style={styles.like}>
            <TouchableOpacity
              onPress={handleLikeIconPress}
              disabled={isDisabled}
            >
              <AntDesign
                name={isLikeIconPressed ? "heart" : "hearto"}
                color={COLORS.accent600}
                size={24}
              />
            </TouchableOpacity>
            <Text style={styles.textSmall}>{likeCount} {i18n.t("reactions")}</Text>
          </View>
          <TouchableOpacity
            style={styles.comment}
            // onPress={handleCommentIconPress}
            disabled
          >
            <View style={styles.comment}>
              <Image source={icons.message} style={styles.commentIcon} />
              <Text style={styles.textSmall}>{commentCount} {i18n.t("commentaires")}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {auth.currentUser && (
          <View style={styles.commentBox}>
            <TextInput
              multiline
              placeholder={i18n.t("ecrireUnCommentaire")}
              style={styles.commentInput}
              value={commentValue}
              onChangeText={setCommentValue}
              editable={!isSubmitting}
            />
            <TouchableOpacity
              onPress={handleCommentSent}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Image source={icons.send} style={styles.sendIcon} />
              )}
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    )
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral100,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: "98%",
    marginHorizontal: "auto",
    marginBottom: 30,
  },
  header: {
    flexDirection: "row",
  },
  headerTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: "gray",
    marginRight: 5,
  },
  authorName: {
    fontFamily: "Bold",
    fontSize: SIZES.small,
    color: "#555",
    maxWidth: "40%",
  },
  date: {
    fontFamily: "Regular",
    fontSize: SIZES.small,
    color: "#888",
    width: "55%",
  },
  content: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontFamily: "SBold",
    fontSize: SIZES.large,
    marginBottom: 10,
  },
  body: {
    lineHeight: 22,
  },
  reactions: {
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 5,
  },
  like: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  comment: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  commentIcon: {
    width: 22,
    height: 22,
  },
  textSmall: {
    fontFamily: "Regular",
    fontSize: SIZES.small,
    color: "#888",
  },
  commentBox: {
    width: "100%",
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 100,
    paddingHorizontal: 15,
    marginTop: 20,
    backgroundColor: "#f0f0f0",
  },
  commentInput: {
    width: "90%",
    height: "100%",
    fontFamily: "Regular",
  },
  sendIcon: {
    width: 19,
    height: 18,
  },
});

export default ForumItem;
