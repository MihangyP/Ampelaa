import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
  FlatList,
  Platform,
} from "react-native";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { COLORS, SIZES } from "@/constants";
import { preferenceState } from "@/services/AmpelaStates";
import { useSelector } from "@legendapp/state/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import i18n from "@/constants/i18n";

// Define task names
const PILL_REMINDER_TASK = "PILL_REMINDER_TASK";
const OVULATION_REMINDER_TASK = "OVULATION_REMINDER_TASK";
const MENSTRUATION_REMINDER_TASK = "MENSTRUATION_REMINDER_TASK";

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Define task handlers
TaskManager.defineTask(PILL_REMINDER_TASK, async ({ data, error }) => {
  if (error) {
    return;
  }

  await handleTaskExecution(PILL_REMINDER_TASK);
});
TaskManager.defineTask(OVULATION_REMINDER_TASK, async ({ data, error }) => {
  if (error) {
    return;
  }

  await handleTaskExecution(OVULATION_REMINDER_TASK);
});
TaskManager.defineTask(MENSTRUATION_REMINDER_TASK, async ({ data, error }) => {
  if (error) {
    return;
  }

  await handleTaskExecution(MENSTRUATION_REMINDER_TASK);
});

// Handle task execution
const handleTaskExecution = async (taskName) => {
  try {
    const storedData = await AsyncStorage.getItem(taskName);
    if (storedData) {
      const { notificationDate, title, body, frequency } =
        JSON.parse(storedData);
      await scheduleNotification(notificationDate, title, body, frequency);
    }
  } catch (error) {}
};

const scheduleNotification = async (
  notificationDate,
  title,
  body,
  frequency
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { someData: "goes here" },
    },
    trigger: null,
    // trigger: {
    //   // repeats: true,
    //   // seconds: 1,
    // },
  });

  if (frequency === "quotidien") {
    const nextNotificationTime = moment(notificationDate)
      .add(1, "day")
      .toDate();
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { someData: "goes here" },
      },
      trigger: { date: nextNotificationTime },
    });
  }
};

const registerTask = async (
  taskName,
  notificationDate,
  title,
  body,
  frequency
) => {
  const status = await BackgroundFetch.getStatusAsync();
  if (
    status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
    status === BackgroundFetch.BackgroundFetchStatus.Denied
  ) {
    return;
  }

  await AsyncStorage.setItem(
    taskName,
    JSON.stringify({ notificationDate, title, body, frequency })
  );

  await BackgroundFetch.registerTaskAsync(taskName, {
    minimumInterval: 60 * 1,
    stopOnTerminate: false,
    startOnBoot: true,
    data: { notificationDate, title, body, frequency },
  });
};

const registerPillReminderTask = async (
  notificationDate,
  title,
  body,
  frequency
) => {
  return await registerTask(
    PILL_REMINDER_TASK,
    notificationDate,
    title,
    body,
    frequency
  );
};
const registerOvulationReminderTask = async (
  notificationDate,
  title,
  body,
  frequency
) => {
  return await registerTask(
    OVULATION_REMINDER_TASK,
    notificationDate,
    title,
    body,
    frequency
  );
};
const registerMenstruationReminderTask = async (
  notificationDate,
  title,
  body,
  frequency
) => {
  return await registerTask(
    MENSTRUATION_REMINDER_TASK,
    notificationDate,
    title,
    body,
    frequency
  );
};

const handleRegistrationError = (errorMessage) => {
  alert(errorMessage);
  throw new Error(errorMessage);
};

const ReminderItem = ({ as, time, howmanytimeReminder, action }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("quotidien");
  const { theme } = useSelector(() => preferenceState.get());

  useEffect(() => {
    let taskName;
    switch (as) {
      case "Prise de pilule":
        taskName = PILL_REMINDER_TASK;
        break;
      case "Jour d'ovulation":
        taskName = OVULATION_REMINDER_TASK;
        break;
      case "Début des règles":
        taskName = MENSTRUATION_REMINDER_TASK;
        break;
      default:
        taskName = MENSTRUATION_REMINDER_TASK;
    }
    checkTaskStatus(taskName);
    loadSelectedFrequency();
  }, [as]);

  const checkTaskStatus = async (taskName) => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(taskName);
    setIsEnabled(isRegistered);
  };

  const toggleSwitch = async () => {
    const notificationDate = new Date();
    notificationDate.setHours(time.hour);
    notificationDate.setMinutes(time.minutes);

    let registerFunction;
    let taskName;

    switch (as) {
      case "Prise de pilule":
        registerFunction = registerPillReminderTask;
        taskName = PILL_REMINDER_TASK;
        break;
      case "Jour d'ovulation":
        registerFunction = registerOvulationReminderTask;
        taskName = OVULATION_REMINDER_TASK;
        break;
      case "Début des règles":
        registerFunction = registerMenstruationReminderTask;
        taskName = MENSTRUATION_REMINDER_TASK;
        break;
      default:
        registerFunction = registerMenstruationReminderTask;
        taskName = MENSTRUATION_REMINDER_TASK;
    }

    const newState = !isEnabled;
    setIsEnabled(newState);

    if (newState) {
      await registerFunction(
        notificationDate.toISOString(),
        as,
        `Reminder for ${as}`,
        selectedFrequency
      );
    } else {
      await BackgroundFetch.unregisterTaskAsync(taskName);
    }
  };

  const loadSelectedFrequency = async () => {
    try {
      const storedFrequency = await AsyncStorage.getItem(`frequency_${as}`);
      if (storedFrequency) {
        setSelectedFrequency(storedFrequency);
        action(storedFrequency);
      }
    } catch (error) {}
  };

  const saveSelectedFrequency = async (frequency) => {
    try {
      await AsyncStorage.setItem(`frequency_${as}`, frequency);
    } catch (error) {}
  };

  const frequencyOptions = [
    { label: "Quotidien", value: "quotidien" },
    { label: "Hebdomadaire", value: "hebdomadaire" },
    { label: "Chaque deux jours", value: "chaquedeuxjours" },
    { label: "Chaque trois jours", value: "chaquetroisjours" },
  ];

  const renderFrequencyItem = ({ item }) => {
    const isSelected = item.value === selectedFrequency;
    const styles = {
      regularFrequency: {
        backgroundColor: COLORS.neutral100,
        color: "black",
        padding: 10,
        borderRadius: 5,
      },
      selectedFrequency: {
        backgroundColor: theme === "pink" ? COLORS.accent600 : COLORS.accent800,
        color: COLORS.white,
        padding: 10,
        borderRadius: 5,
      },
    };
    const itemStyle = isSelected
      ? styles.selectedFrequency
      : styles.regularFrequency;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedFrequency(item.value);
          saveSelectedFrequency(item.label);
          scheduleNotification(
            "yes",
            "Date d'ovulation",
            "Votre date d'ovultion sera le 12-155-121"
          );
          action(item.label);
        }}
      >
        <Text style={[itemStyle, { color: isSelected ? "white" : "black" }]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.container}
      >
        <View style={styles.left}>
          <Text style={styles.textRegular}>{as}</Text>
          <Text style={styles.textRegular}>
            {i18n.t("rappeler")}: {howmanytimeReminder}
          </Text>
        </View>
        <View style={styles.right}>
          <Switch
            trackColor={{
              false: theme === "pink" ? COLORS.neutral200 : COLORS.neutral250,
              true: theme === "pink" ? COLORS.accent600 : COLORS.accent800,
            }}
            thumbColor={isEnabled ? COLORS.neutral100 : COLORS.neutral100}
            ios_backgroundColor={COLORS.neutral200}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView} className="p-3 py-5">
            <Text className="text-[18px] text-center mb-10">{as}</Text>
            <Text className="mb-3">Périodicité</Text>
            <FlatList
              data={frequencyOptions}
              renderItem={renderFrequencyItem}
              keyExtractor={(item) => item.value}
              contentContainerStyle={{ marginBottom: 20 }}
            />
            <Button
              title="Terminer"
              onPress={() => setModalVisible(false)}
              color={theme === "pink" ? COLORS.accent600 : COLORS.accent800}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectedFrequency: {
    backgroundColor: COLORS.accent600,
    color: COLORS.white,
    padding: 10,
    borderRadius: 5,
  },
  regularFrequency: {
    backgroundColor: COLORS.neutral100,
    color: "black",
    padding: 10,
    borderRadius: 5,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.neutral100,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
  },
  left: {
    gap: 12,
    alignItems: "flex-start",
  },
  time: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 20,
  },
  textRegular: {
    fontFamily: "Regular",
    fontSize: SIZES.medium,
  },
  textMedium: {
    fontFamily: "Medium",
    fontSize: SIZES.large,
  },

  frequencyItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  frequencyItemText: {
    fontSize: 16,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  textRegular: {
    fontSize: 16,
    color: "#000",
  },
  modalContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    height: SIZES.height,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    backgroundColor: "white",
    width: SIZES.width - 40,
    minHeight: SIZES.height * 0.3,
    borderRadius: 5,
  },
});

export default ReminderItem;
