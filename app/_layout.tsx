import { Stack } from "expo-router";
import React from "react";

import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen options={{ headerShown: false }} name="(auth)" />
      <Stack.Screen options={{ headerShown: false }} name="(tabs)" />
      <Stack.Screen options={{ headerShown: false }} name="index" />
    </Stack>
  );
}
