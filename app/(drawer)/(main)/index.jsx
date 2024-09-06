import { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";
import { COLORS, SIZES } from "@/constants";
import BackgroundContainer from "@/components/background-container";
import IndicationCalendar from "@/components/calendar/indication-calendar";
import { Calendar, LocaleConfig } from "react-native-calendars";
import ReminderItem from "@/components/calendar/reminder-item";
import moment from "moment";
import { useSelector } from "@legendapp/state/react";
import {
  cycleMenstruelState,
  preferenceState,
} from "@/services/AmpelaStates";
import i18n from "@/constants/i18n";

const Index = () => {
  const [howmanytimeReminder1, setHowmanytimeReminder1] = useState("quotidien");
  const [howmanytimeReminder2, setHowmanytimeReminder2] = useState("quotidien");
  const [howmanytimeReminder3, setHowmanytimeReminder3] = useState("quotidien");
  const [scrollDisabled, setScrollDisabled] = useState(true);
  const { theme, language } = useSelector(() => preferenceState.get());

  const [time1, setTime1] = useState({
    hour: 0,
    minutes: 0,
  });
  const [time2, setTime2] = useState({
    hour: 0,
    minutes: 0,
  });
  const [time3, setTime3] = useState({
    hour: 0,
    minutes: 0,
  });

  i18n.defaultLocale = "fr";
  i18n.locale = language || i18n.defaultLocale;

  LocaleConfig.locales["fr"] = {
    monthNames: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
    monthNamesShort: [
      "Janv.",
      "Févr.",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juil.",
      "Août",
      "Sept.",
      "Oct.",
      "Nov.",
      "Déc.",
    ],
    dayNames: [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ],
    dayNamesShort: ["Di.", "Lu.", "Ma.", "Me.", "Je.", "Ve.", "Sa."],
    today: "Aujourd'hui",
  };

  LocaleConfig.locales["mg"] = {
    monthNames: [
      "Janoary",
      "Febroary",
      "Martsa",
      "Aprily",
      "May",
      "Jona",
      "Jolay",
      "Aogositra",
      "Septambra",
      "Oktobra",
      "Novambra",
      "Desambra",
    ],
    monthNamesShort: [
      "Jan.",
      "Febr.",
      "Mar.",
      "Apr.",
      "May",
      "Jona",
      "Jolay.",
      "Aogo.",
      "Sept.",
      "Oct.",
      "Nov.",
      "Des.",
    ],
    dayNames: [
      "Alahady",
      "Alatsinainy",
      "Talata",
      "Alarobia",
      "Alakamisy",
      "Zoma",
      "Sabotsy",
    ],
    dayNamesShort: ["Alh.", "Alt.", "Tal.", "Alr.", "Alk.", "Zo.", "Sa."],
    today: "Androany",
  };

  LocaleConfig.defaultLocale = language;

  const handleReminderBtnOnePress = () => {
    setReminderInfo({ as: "Début des règles" });
    setReminderModalIsVisible(true);
  };

  const handleReminderBtnTwoPress = () => {
    setReminderInfo({ as: "Jour d'ovulation" });
    setReminderModalIsVisible(true);
  };

  const handleReminderBtnThreePress = () => {
    setReminderInfo({ as: "Prise de pilule" });
    setReminderModalIsVisible(true);
  };

  const { cyclesData } = useSelector(() => cycleMenstruelState.get());
  const cycles = cyclesData?.cyclesData ? cyclesData?.cyclesData : cyclesData;

  const markedDates = {};
  const generateMarkedDates = () => {
    cycles.forEach((cycle) => {
      // FECONDITY
      let start = moment(cycle.fecundityPeriodStart);
      let end = moment(cycle.fecundityPeriodEnd);

      while (start <= end) {
        markedDates[start.format("YYYY-MM-DD")] = {
          customStyles: {
            container: {
              backgroundColor:
                theme === "orange" ? COLORS.neutral250 : COLORS.accent400,
            },
            text: {
              color: "#fff",
            },
          },
        };
        start = start.add(1, "day");
      }

      // OVULATION
      markedDates[cycle.ovulationDate] = {
        customStyles: {
          container: {
            borderStyle: "solid",
            borderColor:
              theme === "orange" ? COLORS.accent800 : COLORS.accent500,
            borderWidth: 2,
          },
          text: {
            color: "#000",
          },
        },
      };

      // MENSTRUATION
      for (let i = 0; i < cycle.durationMenstruation; i++) {
        markedDates[
          moment(cycle.startMenstruationDate)
            .add(i, "days")
            .format("YYYY-MM-DD")
        ] = {
          customStyles: {
            container: {
              backgroundColor:
                theme === "orange" ? COLORS.accent800 : COLORS.accent600,
            },
            text: {
              color: "#fff",
            },
          },
        };
      }
    });
  };

  generateMarkedDates();

  return (
    // <SafeAreaView className="flex-1">
    <ScrollView
      scrollEnabled={scrollDisabled}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <BackgroundContainer paddingBottom={10}>
        <View style={styles.calendar}>
          <Calendar
            disableAllTouchEventsForDisabledDays={true}
            style={{
              height: 380,
              borderRadius: 8,
            }}
            theme={{
              textSectionTitleColor: COLORS.neutral400,
              todayTextColor: COLORS.primary,
              dayTextColor: "#2d4150",
              textDisabledColor: COLORS.neutral400,
              arrowColor: COLORS.primary,
              monthTextColor: COLORS.primary,
              textDayFontFamily: "Regular",
              textMonthFontFamily: "SBold",
              textDayHeaderFontFamily: "Regular",
              textDayFontSize: SIZES.medium,
              textMonthFontSize: SIZES.large,
              textDayHeaderFontSize: SIZES.medium,
            }}
            markedDates={markedDates}
            enableSwipeMonths={true}
            markingType="custom"
          />
        </View>
        <View style={styles.indications}>
          <IndicationCalendar title="Jours des règles" />
          <IndicationCalendar title="Ovulation" />
          <IndicationCalendar title="Période de fécondité" />
        </View>
        <View
          style={[
            styles.reminder,
            {
              backgroundColor:
                theme === "pink"
                  ? "rgba(255, 255, 255, .5)"
                  : "rgba(238, 220, 174, .5)",
            },
          ]}
          className="p-2"
        >
          <Text style={styles.reminderTitle}>{i18n.t("rappels")}</Text>
          <View style={{ gap: 10 }}>
            <ReminderItem
                as={i18n.t("debutDesRegles")}
                onPress={handleReminderBtnOnePress}
                time={time1}
                howmanytimeReminder={howmanytimeReminder1}
                action={setHowmanytimeReminder1}
              />
              <ReminderItem
                as={i18n.t("jourDOvulation")}
                onPress={handleReminderBtnTwoPress}
                time={time2}
                howmanytimeReminder={howmanytimeReminder2}
                action={setHowmanytimeReminder2}
              />
              <ReminderItem
                as={i18n.t("priseDePillule")}
                onPress={handleReminderBtnThreePress}
                time={time3}
                howmanytimeReminder={howmanytimeReminder3}
                action={setHowmanytimeReminder3}
              />
          </View>
        </View>
      </BackgroundContainer>
    </ScrollView>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.accent500,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  // container: {
  //   // height: "150%",
  //   height: 5000
  // },
  reminderContainer: {
    position: "absolute",
    alignItems: "center",
    paddingTop: "50%",
    top: 0,
    right: -20,
    left: -20,
    bottom: 0,
    zIndex: 999,
  },
  title: {
    fontFamily: "Bold",
    textAlign: "center",
    marginTop: 60,
  },
  calendar: {
    marginTop: 40,
    marginBottom: 20,
  },
  indications: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 10,
  },
  reminderTitle: {
    fontFamily: "SBold",
    fontSize: 17,
    marginBottom: 20,
  },
  reminder: {
    marginTop: 20,
    marginBottom: 100,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});

export default Index;
