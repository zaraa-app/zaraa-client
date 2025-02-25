import { SplashScreen, Stack } from "expo-router";
import React from "react";

import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  SplashScreen.hideAsync();

  return (
    <Stack>
      <Stack.Screen options={{ headerShown: false }} name="(auth)" />
      <Stack.Screen options={{ headerShown: false }} name="(tabs)" />
      <Stack.Screen options={{ headerShown: false }} name="index" />
    </Stack>
  );
}
