import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { COLORS, FONT, SIZES } from "../../constants";
import { Calendar } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "@legendapp/state/react";
import { updateUser, userState } from "@/services/AmpelaStates";

const LastMenstrualCycleStartAge = () => {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const firstDayOfMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-01`;

  const [selected, setSelected] = useState(todayString);
  const [isNextBtnDisabled, setIsNextBtnDisabled] = useState(true);

  const navigation = useNavigation();
  const user = useSelector(() => userState.get());

  useEffect(() => {
    if (selected) {
      setIsNextBtnDisabled(false);
    }
  }, [selected]);

  useEffect(() => {
    const dateToUpdate = selected === "" ? firstDayOfMonth : selected;
    const userData = {
      lastMenstruationDate: dateToUpdate,
    };
    updateUser(userData);
  }, [selected]);

  const handleNextBtnPress = () => {
    navigation.navigate("questionsSeries");
  };

  const handleDateChange = (day) => {
    const selectedDate = day.dateString;
    if (new Date(selectedDate) <= today) {
      setSelected(selectedDate);
    } else {
    }
  };

  const handleForgetDate = () => {
    setSelected("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View className="p-5" style={[]}>
        <Text
          style={[styles.confidentialityTitle, { color: COLORS.accent500 }]}
          className="rounded-b-xl pt-20 text-white"
        >
          date de vos dernières règles
        </Text>
        <Text style={styles.infoText}>
          Si vous voulez participer au message privée et forum, veuillez vous
          connecter ou créer un compte.
        </Text>
      </View>
      <View style={styles.calendar}>
        <Calendar
          style={{
            height: 340,
            borderRadius: 8,
            backgroundColor: "rgba(255, 255, 255, .5)",
          }}
          maxDate={todayString}
          theme={{
            textSectionTitleColor: COLORS.neutral400,
            todayTextColor: COLORS.primary,
            dayTextColor: "#2d4150",
            textDisabledColor: COLORS.neutral400,
            arrowColor: COLORS.primary,
            monthTextColor: COLORS.primary,
            textDayFontFamily: "Regular",
            textMonthFontFamily: "Bold",
            textDayHeaderFontFamily: "Regular",
            textDayFontSize: SIZES.medium,
            textMonthFontSize: SIZES.large,
            textDayHeaderFontSize: SIZES.medium,
          }}
          onDayPress={handleDateChange}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: COLORS.accent600,
              selectedTextColor: COLORS.neutral100,
            },
          }}
        />
        <TouchableOpacity
          className="items-center rounded-md px-5"
          onPress={handleForgetDate}
          style={{
            borderWidth: selected === "" ? 1 : 0,
            borderColor: COLORS.accent600,
            padding: 10,
          }}
        >
          <Text className="text-[#E2445C]">Je ne me souviens plus</Text>
        </TouchableOpacity>
      </View>
      <View
        style={styles.btnBox}
        className="flex items-center justify-between flex-row p-5"
      >
        <TouchableOpacity
          className="p-3 items-center rounded-md px-5"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-[#8a8888]" style={{ fontSize: FONT.button }}>
            Précédent
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-3 items-center rounded-md px-5 shadow-sm shadow-black"
          onPress={handleNextBtnPress}
          disabled={isNextBtnDisabled}
          style={{
            backgroundColor: isNextBtnDisabled ? "#e7e5e5" : "#FF7575",
          }}
        >
          <Text className="text-white" style={{ fontSize: FONT.button }}>
            Suivant
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral100,
  },
  confidentialityTitle: {
    fontSize: SIZES.width * 0.08,
    fontFamily: "Bold",
  },
  pageContainer: {
    padding: 20,
    justifyContent: "center",
  },
  infoText: {
    marginTop: 20,
  },
  title: {
    fontSize: SIZES.width * 0.08,
    fontFamily: "Bold",
    textAlign: "center",
    height: SIZES.height * 0.3,
  },
  calendar: {
    width: SIZES.width,
    height: SIZES.height * 0.6,
    padding: 10,
  },
  btnBox: {
    // height: SIZES.height * 0.15,
    width: SIZES.width,
  },
});

export default LastMenstrualCycleStartAge;
