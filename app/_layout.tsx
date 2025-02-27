import { SplashScreen, Stack } from "expo-router";
import React from "react";

import "../global.css";
import GlobalProvider from "@/context/GlobalProvider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  SplashScreen.hideAsync();

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen options={{ headerShown: false }} name="(auth)" />
        <Stack.Screen options={{ headerShown: false }} name="(tabs)" />
        <Stack.Screen options={{ headerShown: false }} name="index" />
      </Stack>
    </GlobalProvider>
  );
}
