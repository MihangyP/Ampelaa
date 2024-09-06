import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, SIZES } from "@/constants";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
} from "firebase/firestore";
import { database } from "@/services/firebaseConfig";
import { useAuth } from "@/hooks/AuthContext";

const MessageItem = ({ onPress, target }) => {
  const [lastMessage, setLastMessage] = useState();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid && target?.userId) {
      const roomId = getRoomId(user?.uid, target?.userId);
      const docRef = doc(database, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");
      const q = query(messagesRef, orderBy("createdAt", "desc"));

      const unsub = onSnapshot(q, (snapshot) => {
        const allMessages = snapshot.docs.map((doc) => doc.data());
        setLastMessage(allMessages.length > 0 ? allMessages[0] : null);
      });

      return () => unsub();
    }
  }, [lastMessage]);

  const getRoomId = (userId1, userId2) => {
    const sortedIds = [userId1, userId2].sort();
    return sortedIds.join("_");
  };
  const renderLastMessage = () => {
    if (!lastMessage) return "Say Hi";
    const messageText = lastMessage.text;
    const sender = lastMessage.userId === user?.uid ? "You" : target.username;
    return `${sender}: ${messageText}`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.toDate) {
      return "";
    }

    const date = timestamp.toDate();
    const now = new Date();
    const isSameDay = date.toDateString() === now.toDateString();

    if (isSameDay) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    } else {
      return date.toLocaleDateString();
    }
  };
  return (
    <TouchableOpacity
      style={styles.container}
      className="justify-between"
      onPress={onPress}
    >
      <View className="flex-row">
        <View
          style={styles.imageContainer}
          className="border border-gray-400 rounded-full "
        >
          <Image source={{ uri: target?.profileImage }} style={styles.image} />

          {/* <View
            style={{
              position: "absolute",
              width: 10,
              height: 10,
              borderRadius: 100,
              backgroundColor: COLORS.accent600,
              top: 1,
              left: 5,
            }}
          /> */}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{target?.username}</Text>
          <Text style={styles.job}>{target?.job}</Text>
          <Text
            style={[
              styles.lastMessage,
,
            ]}
            numberOfLines={1}
          >
            {renderLastMessage()}
          </Text>
        </View>
      </View>
      <Text>{formatTimestamp(lastMessage?.createdAt)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 40,
    marginLeft: 15,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  textContainer: {
    marginLeft: 15,
  },
  name: {
    fontFamily: "Regular",
    fontSize: SIZES.medium,
  },
  job: {
    fontSize: SIZES.xSmall,
    color: COLORS.neutral400,
  },
  lastMessage: {
    fontFamily: "Regular",
    fontSize: SIZES.small,
    color: COLORS.neutral400,
    marginTop: 5,
  },
});

export default MessageItem;
