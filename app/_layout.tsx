import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";

import "../global.css";
import GlobalProvider, { useGlobalContext } from "@/context/GlobalProvider";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { isLoading } = useGlobalContext();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });

  return (
    <Stack screenOptions={{ animation: "fade", animationDuration: 200 }}>
      <Stack.Screen options={{ headerShown: false, animation: "slide_from_right", animationDuration: 200 }} name="(auth)" />
      <Stack.Screen options={{ headerShown: false }} name="(tabs)" />
      <Stack.Screen options={{ headerShown: false }} name="index" />
      <Stack.Screen options={{ headerShown: false, presentation: "fullScreenModal" }} name="all-set" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GlobalProvider>
      <RootLayoutContent />
      <Toast position="bottom" />
    </GlobalProvider>
  );
}
