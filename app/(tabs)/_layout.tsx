import React from "react";
import { Tabs } from "expo-router";
import TopBar from "@/components/TopBar/TopBar";
import { CategoryProvider } from "@/context/CategoryContext";
import { ChapterProvider } from "@/context/ChapterContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const TabsLayout = () => {
  return (
    <CategoryProvider>
      <ChapterProvider>
        <Tabs screenOptions={{ animation: "fade" }}>
          <Tabs.Screen name="dashboard" options={{ header: () => <TopBar pageType="dashboard" /> }} />
          <Tabs.Screen name="leaderboard" options={{ header: () => <TopBar pageType="leaderboard" /> }} />
          <Tabs.Screen name="forums" options={{ header: () => <TopBar pageType="forums" /> }} />
          <Tabs.Screen name="profile" options={{ header: () => <TopBar pageType="profile" /> }} />
        </Tabs>
      </ChapterProvider>
    </CategoryProvider>
  );
};
export default TabsLayout;
