import React, { useEffect } from "react";
import { getAllCycle, getUser, setFirstLaunchFalse } from "@/services/database";
import { Tabs, useNavigation } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MyTabBar from "@/components/navigation/MyTabBar";
import {
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS, SIZES } from "@/constants";
import { useSelector } from "@legendapp/state/react";
import {
  userState,
  cycleMenstruelState,
  updateUser,
  updateCycleMenstruelData,
  preferenceState,
} from "@/services/AmpelaStates";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuDraggable from "@/components/MenuDraggable";

const TabLayout = () => {
  const user = useSelector(() => userState.get());
  const navigation = useNavigation();
  const { theme, language } = useSelector(() => preferenceState.get());

  useEffect(() => {
    async function fetchData() {
      try {
        await setFirstLaunchFalse();
        // const cyclesFromSqlite = await getAllCycle();
        // updateCycleMenstruelData(cyclesFromSqlite);
        const preferenceData = { theme: theme, language: language };
        updatePreference(preferenceData);
        i18n.defaultLocale = language;
      } catch (error) {}
    }
    fetchData();
  }, []);

  const UserAvatar = ({ username }) => {
    const displayText =
      username?.length > 10 ? username.charAt(0).toUpperCase() : username;

    return (
      <View style={[styles.container]}>
        {username?.length > 10 ? (
          <View
            style={[
              styles.avatar,
              {
                backgroundColor:
                  theme === "pink" ? COLORS.neutral200 : COLORS.neutral280,
              },
            ]}
          >
            <Text style={styles.avatarText}>{displayText}</Text>
          </View>
        ) : (
          <Text style={styles.username}>{displayText}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="bg-red-400 flex-1">
      <Tabs
        screenOptions={{
          header: () => (
            <View
              className="w-full flex-row items-center pt-10  pb-3 rounded-b-lg justify-between"
              style={{
                backgroundColor:
                  theme === "orange" ? COLORS.accent800 : COLORS.accent500,
                height: SIZES.height * 0.14,
                paddingHorizontal: 16,
              }}
            >
              <View className="flex flex-row items-center justify-center">
                <TouchableOpacity
                  className="p-2 pl-0 mr-3 space-y-1"
                  onPress={() => navigation.openDrawer()}
                >
                  <View className="h-[5] w-7 bg-white rounded-md" />
                  <View className="h-[5] w-8 bg-white rounded-md ml-[2px]" />
                  <View className="h-[5] w-7 bg-white rounded-md" />
                </TouchableOpacity>
                <UserAvatar username={user.username} />
              </View>
              <View className="flex-row">
                <TouchableOpacity
                  className="p-2 pl-0 relative"
                  onPress={() => navigation.navigate("(message)")}
                >
                  <Text className="absolute text-white">1</Text>
                  <Ionicons name="chatbubble" color={"white"} size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-2 pl-0 relative"
                  onPress={() => navigation.navigate("(message)")}
                >
                  <Text className="absolute text-white">1</Text>
                  <Ionicons
                    name="notifications-circle"
                    color={"white"}
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ),
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
        }}
        tabBar={(props) => <MyTabBar {...props} />}
        // tabBar={(props) => null}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: "calendar",
          }}
        />
        <Tabs.Screen
          name="(article)"
          options={{
            title: "Article",
            tabBarIcon: "book",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(forum)"
          options={{
            title: "Forum",
            tabBarIcon: "globe-outline",
            headerShown: false,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,

    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default TabLayout;
