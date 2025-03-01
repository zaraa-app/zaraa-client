import React from "react";
import { Tabs } from "expo-router";
const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ headerShown: false }} />
    </Tabs>
  );
};
export default TabsLayout;
