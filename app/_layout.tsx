import { SplashScreen, Stack } from "expo-router";
import React from "react";

import "../global.css";
import GlobalProvider from "@/context/GlobalProvider";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  SplashScreen.hideAsync();

  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });

  return (
    <GlobalProvider>
      <Stack screenOptions={{ animation: "fade", animationDuration: 200 }}>
        <Stack.Screen options={{ headerShown: false, animation: "slide_from_right", animationDuration: 200 }} name="(auth)" />
        <Stack.Screen options={{ headerShown: false }} name="(tabs)" />
        <Stack.Screen options={{ headerShown: false }} name="index" />
        <Stack.Screen options={{ headerShown: false, presentation: "fullScreenModal" }} name="all-set" />
      </Stack>
    </GlobalProvider>
  );
}
