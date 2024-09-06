import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import moment from "moment";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export async function scheduleNotification(title, body, date) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      sound: "notification.mp3",
      priority: Notifications.AndroidNotificationPriority.HIGH,
      sticky: true,
      actions: [
        {
          identifier: "pause",
          buttonTitle: "Pause",
          options: {
            isDestructive: false,
            isAuthenticationRequired: false,
          },
        },
        {
          identifier: "stop",
          buttonTitle: "Stop",
          options: {
            isDestructive: true,
            isAuthenticationRequired: false,
          },
        },
      ],
    },
    trigger: 1,
  });
}

export async function scheduleCycleNotifications(
  lastMenstruationDate,
  cycleDuration
) {
  const menstruationDate = moment(lastMenstruationDate);
  const ovulationDate = menstruationDate.clone().add(cycleDuration / 2, "days");

  await scheduleNotification(
    "Rappel de Menstruation",
    "Votre menstruation commence aujourd'hui.",
    menstruationDate.toDate()
  );
  await scheduleNotification(
    "Rappel de Menstruation",
    "Votre menstruation commence aujourd'hui.",
    menstruationDate.toDate()
  );

  await scheduleNotification(
    "Rappel d'Ovulation",
    "Aujourd'hui est votre jour d'ovulation.",
    ovulationDate.toDate()
  );

  const reminderTime = moment().add(i, "minutes").toDate();
  await scheduleNotification(
    "Rappel de Pilule",
    "N'oubliez pas de prendre votre pilule.",
    reminderTime
  );

  const dailyPillReminderTime = moment().add(1, "minutes").toDate();
  await scheduleNotification(
    "Rappel de Pilule",
    "N'oubliez pas de prendre votre pilule aujourd'hui.",
    dailyPillReminderTime
  );
}

TaskManager.defineTask("BACKGROUND_FETCH_TASK", async () => {
  try {
    
    return BackgroundFetch.Result.NewData;
  } catch (error) {
    return BackgroundFetch.Result.Failed;
  }
});

const registerBackgroundFetch = async () => {
  await BackgroundFetch.registerTaskAsync("BACKGROUND_FETCH_TASK", {
    minimumInterval: 60,
    stopOnTerminate: false,
    startOnBoot: true,
  });
};

registerBackgroundFetch();
