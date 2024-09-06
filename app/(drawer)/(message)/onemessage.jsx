import OptionMenu from "@/components/navigation/OptionMenu";
import { COLORS, SIZES, images } from "@/constants";
import i18n from "@/constants/i18n";
import { useAuth } from "@/hooks/AuthContext";
import { preferenceState } from "@/services/AmpelaStates";
import { database } from "@/services/firebaseConfig";
import { Feather, Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSelector } from "@legendapp/state/react";
import { useRoute } from "@react-navigation/native";

import { router, useNavigation } from "expo-router";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  Image,
} from "react-native";
import {
  Bubble,
  GiftedChat,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function OneMessageScreen() {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const { theme } = useSelector(() => preferenceState.get());
  const route = useRoute();
  const { target } = route?.params;
  const { user, userProfile } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const scale = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(scale.value, { damping: 10, stiffness: 200 }) },
    ],
  }));

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    scale.value = isModalVisible ? 0 : 1;
  };

  const menuItems = [
    {
      title: "Voir profil du docteur",
      action: () =>
        navigation.navigate("DoctorProfile", { doctorId: target?.id }),
    },
    {
      title: "Effacer tous les messages",
      action: () => toggleModal(),
    },
    {
      title: "Revenir à l'accueil",
      action: () => navigation.navigate("(drawer)/"),
    },
  ];

  useEffect(() => {
    createRoomIfNotExists();
    const roomId = getRoomId(user?.uid, target?.id);
    const docRef = doc(database, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        if (data.createdAt) {
          const date = data.createdAt.toDate();
          data.createdAt = date.toISOString();
        }
        return data;
      });
      setMessages(allMessages);
    });

    return unsub;
  }, [user, target]);

  const createRoomIfNotExists = async () => {
    const roomId = getRoomId(user?.uid, target?.id);
    await setDoc(doc(database, "rooms", roomId), {
      roomId,
      createdAt: Timestamp.fromDate(new Date()),
    });
  };

  const getRoomId = (id1, id2) => {
    const sortedIds = [id1, id2].sort();
    const roomId = sortedIds.join("_");
    return roomId;
  };

  const handleSend = useCallback(async (newMessages = []) => {
    try {
      const roomId = getRoomId(user?.uid, target?.id);
      const docRef = doc(database, "rooms", roomId);
      const messagesRef = collection(docRef, "messages");
      let message = newMessages[0];

      let myMsg = {
        ...message,
        id: user?.uid,
        avatar: userProfile?.profileImage,
        expediteur: userProfile?.username,
        createdAt: Timestamp.now(),
      };

      await addDoc(messagesRef, myMsg);

      // setMessages((previousMessages) =>
      //   GiftedChat.append(...previousMessages, myMsg)
      // );
    } catch (error) {
      
    }
  }, []);

  const confirmClear = async () => {
    const roomId = getRoomId(user?.uid, target?.id);
    const docRef = doc(database, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef);

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });

    setMessages([]);
    toggleModal();
  };

  const renderBubble = (props) => {
    const { currentMessage } = props;
    return (
      <Bubble
        key={currentMessage._id}
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor:
              theme === "pink" ? COLORS.neutral100 : "rgba(196, 196, 196, .5)",
            borderRadius: 15,
          },
          right: {
            backgroundColor:
              theme === "pink" ? COLORS.accent500 : COLORS.accent800,
            borderRadius: 15,
          },
        }}
        textStyle={{
          left: {
            color: COLORS.primary,
            fontFamily: "Regular",
          },
          right: {
            color: "white",
            fontFamily: "Regular",
          },
        }}
      />
    );
  };

  const customInputToolbar = (props) => {
    return (
      <View style={styles.inputToolbarContainer} className="">
        <InputToolbar {...props} containerStyle={styles.inputToolbar} />
      </View>
    );
  };

  const DoctorInfo = () => {
    return (
      <View style={styles.doctorInfoContainer}>
        <Image
          source={
            target?.profileImage
              ? { uri: target?.profileImage }
              : images.doctor01
          }
          style={styles.doctorImage}
        />
        <Text style={styles.doctorName}>{target?.username}</Text>
        <Text style={styles.doctorSpeciality}>{target?.speciality}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 " style={{ backgroundColor: COLORS.bg100 }}>
      <View
        className="w-full flex-row items-center pt-10  pb-3 rounded-b-lg justify-between  absolute  z-50"
        style={{
          backgroundColor:
            theme === "orange" ? COLORS.accent800 : COLORS.accent500,
          height: SIZES.height * 0.14,
          paddingHorizontal: 16,
        }}
      >
        <View className="flex flex-row  items-center justify-center ">
          <TouchableOpacity
            className="p-2 pl-0 mr-3"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" color={"white"} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{target?.username}</Text>
        </View>
        <OptionMenu menuItems={menuItems} />
      </View>

      <GiftedChat
        placeholder="ecrire un message"
        messages={messages}
        onSend={(messages) => handleSend(messages)}
        user={{
          _id: user?.uid,
          avatar: userProfile?.profileImage,
        }}
        infiniteScroll
        renderChatEmpty={DoctorInfo}
        renderBubble={renderBubble}
        renderInputToolbar={(props) => customInputToolbar(props)}
        renderSend={(props) => {
          return (
            <Send {...props}>
              <View style={styles.sendButton}>
                <Feather
                  name="send"
                  size={24}
                  color={theme === "pink" ? COLORS.accent500 : COLORS.accent800}
                />
              </View>
            </Send>
          );
        }}
      />

      <Modal visible={isModalVisible} onRequestClose={toggleModal} transparent>
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <Animated.View
            style={[
              styles.modalContent,
              animatedStyle,
              { padding: 10, paddingVertical: 20, width: 300 },
            ]}
          >
            <Text style={styles.modalTitle}>Confirmer la suppression</Text>
            <Text style={styles.modalMessage}>
              Êtes-vous sûr de vouloir supprimer tous les messages ?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={confirmClear}
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      theme === "pink" ? COLORS.accent500 : COLORS.accent800,
                  },
                ]}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {i18n.t("oui")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleModal} style={styles.button}>
                <Text style={styles.buttonText}>{i18n.t("non")}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.accent800,
    height: SIZES.height * 0.16,
    paddingHorizontal: 16,
    display: "absolute",
  },
  backButton: {
    padding: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  settingsButton: {
    padding: 12,
  },
  inputToolbarContainer: {
    width: "95%",
    padding: 20,
    bottom: 0,
    alignSelf: "center",
  },
  inputToolbar: {
    backgroundColor: "white",
    borderTopWidth: 0,
    borderRadius: 98,
    paddingHorizontal: 10,
  },
  sendButton: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalMessage: {
    fontSize: 16,
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#d1d5db",
    borderRadius: 4,
    minWidth: 60,
  },
  buttonText: {
    color: "#111827",
    fontWeight: "bold",
    textAlign: "center",
  },
  doctorInfoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    transform: [
      {
        rotate: "181deg", 
      },
    ],
  },
  doctorImage: {
    width: 150,
    height: 150,
    borderRadius: 150,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  doctorSpeciality: {
    fontSize: 16,
    color: "gray",
    marginTop: 5,
  },
});
