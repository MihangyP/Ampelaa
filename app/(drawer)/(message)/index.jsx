import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import {
  getDocs,
  collection,
  orderBy,
  limit,
  query as firestoreQuery,
} from "firebase/firestore";
import { COLORS, SIZES } from "@/constants";
import MessageItem from "@/components/messageItem";
import { useNavigation } from "expo-router";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "@/constants/i18n";
import { useAuth } from "@/hooks/AuthContext";
import {
  preferenceState,
  userState,
  doctorsState,
} from "@/services/AmpelaStates";
import { useSelector } from "@legendapp/state/react";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import AuthContent from "@/components/AuthContentFromSetting";
import { useModal } from "@/hooks/ModalProvider";
import { auth, database } from "@/services/firebaseConfig";

const jaccardDistance = (str1, str2) => {
  const set1 = new Set(str1.split(""));
  const set2 = new Set(str2.split(""));
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return 1 - intersection.size / union.size;
};

const index = () => {
  const { theme } = useSelector(() => preferenceState.get());
  const navigation = useNavigation();
  const { user } = useAuth();
  const userData = useSelector(() => userState.get());
  const doctors = useSelector(() => doctorsState.get());
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { isConnected, isInternetReachable } = useNetInfo();
  const { openModal, closeModal } = useModal();

  const fetchDoctorsData = async () => {
    try {
      const querySnapshot = await getDocs(collection(database, "doctors"));
      const doctors = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      doctorsState.set(doctors);
      return doctors;
    } catch (error) {
      
      return [];
    }
  };

  const fetchUsersWithLastMessages = async (doctors) => {
    const userPromises = doctors.map(async (doctor) => {
      const roomId = getRoomId(userData.id, doctor.id);
      const messagesRef = collection(database, "rooms", roomId, "messages");
      const lastMessageQuery = firestoreQuery(
        messagesRef,
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const lastMessageSnapshot = await getDocs(lastMessageQuery);
      const lastMessage = lastMessageSnapshot.docs[0]?.data();
      return { ...doctor, lastMessage: lastMessage?.createdAt || null };
    });

    const data = await Promise.all(userPromises);
    data.sort(
      (a, b) =>
        (b.lastMessage ? b.lastMessage.seconds : 0) -
        (a.lastMessage ? a.lastMessage.seconds : 0)
    );
    setUsers(data);
  };

  const fetchData = async () => {
    setLoading(true);
    const doctors = await fetchDoctorsData();
    if (user) {
      await fetchUsersWithLastMessages(doctors);
    } else {
      setUsers(doctors);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (!auth.currentUser) {
      openModal(<AuthContent closeModal={closeModal} />);
    }
  }, [auth.currentUser]);

  useEffect(() => {
    if (isConnected && isInternetReachable) {
      fetchData();
    }
  }, [user, isConnected, isInternetReachable]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const getRoomId = (userId1, userId2) => {
    const sortedIds = [userId1, userId2].sort();
    return sortedIds.join("_");
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text === "") {
      fetchData();
    } else {
      const usersFiltered = users.filter(
        (i) =>
          jaccardDistance(i.username.toLowerCase(), text.toLowerCase()) <= 0.4
      );
      setUsers(usersFiltered);
    }
  };

  const handleMessageItemPress = (target) => {
    if (user) {
      navigation.navigate("onemessage", { target });
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: COLORS.bg100,
        },
      ]}
    >
      <View style={{ marginVertical: 30, paddingTop: 90 }}>
        <View style={[styles.inputBox]} className="shadow-sm shadow-black">
          <TextInput
            style={{
              fontFamily: "Medium",
              fontSize: SIZES.medium,
              width: "90%",
            }}
            placeholder={i18n.t("rechercher")}
            onChangeText={handleSearch}
          />
          <AntDesign name="search1" size={20} />
        </View>
      </View>
      {!isConnected ||
        (!isInternetReachable && (
          <View style={styles.offlineContainer}>
            <MaterialCommunityIcons
              name="wifi-off"
              size={24}
              color="red"
              style={styles.icon}
            />
            <Text style={styles.text}>Hors ligne</Text>
          </View>
        ))}

      {!loading && isConnected && isInternetReachable && (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={users}
          renderItem={({ item, index }) => (
            <MessageItem
              key={index}
              onPress={() => handleMessageItemPress(item)}
              customStyles={{ marginBottom: 10 }}
              target={item}
              disabled={!user}
            />
          )}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator
                size="large"
                color={theme == "pink" ? COLORS.accent500 : COLORS.accent800}
                style={{ marginTop: 20 }}
              />
            ) : users.length === 0 ? (
              <View className="items-center justify-center">
                <Text>Pas de données pour le moment</Text>
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {loading && isConnected && isInternetReachable && (
        <ActivityIndicator
          size="large"
          color={theme == "pink" ? COLORS.accent500 : COLORS.accent800}
          style={{ marginTop: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  inputBox: {
    width: "100%",
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.neutral100,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 99,
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
});

export default index;
