import React, { useEffect, useState } from "react";
import { SplashScreen, router, useNavigationContainerRef } from "expo-router";
import { useFonts } from "expo-font";
import { isFirstLaunch, initializeDatabase } from "@/services/database";
import LoadingScreen from "@/components/Splash";
import { updatePreference } from "@/services/AmpelaStates";
import i18n from "@/constants/i18n";

export { ErrorBoundary } from "expo-router";

async function fetchInitialData(
  setIsFirstTime,
  setInitialRouteName,
  setLoaded
) {
  try {
    const firstLaunch = await isFirstLaunch();
    const isFirstTimeLaunch = firstLaunch?.status ?? 1;
    setIsFirstTime(isFirstTimeLaunch);

    console.log(isFirstTimeLaunch);
    if (isFirstTimeLaunch) {
      await initializeDatabase();
      const preferenceData = { theme: "pink", language: "fr" };
      await updatePreference(preferenceData);
      i18n.defaultLocale = "fr";
    }

    setInitialRouteName(
      isFirstTimeLaunch ? "(drawer)/(main)" : "(drawer)/(main)"
    );
  } catch (error) {
    console.log(error);
  } finally {
    setLoaded(true);
  }
}

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const navigation = useNavigationContainerRef();
  const [isFirstTime, setIsFirstTime] = useState(null);
  const [initialRouteName, setInitialRouteName] = useState("(discovery)");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchInitialData(setIsFirstTime, setInitialRouteName, setLoaded);
  }, []);

  const [fontsLoaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Regular: require("../assets/fonts/WorkSans-Regular.ttf"),
    Bold: require("../assets/fonts/WorkSans-Bold.ttf"),
    Medium: require("../assets/fonts/WorkSans-Medium.ttf"),
    SBold: require("../assets/fonts/WorkSans-SemiBold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (navigation?.isReady && initialRouteName && fontsLoaded && loaded) {
      SplashScreen.hideAsync();
      router.replace(initialRouteName);
    }
  }, [navigation?.isReady, initialRouteName, fontsLoaded, loaded]);

  return <LoadingScreen />;
}
