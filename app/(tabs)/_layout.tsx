import React from "react";
import { Tabs } from "expo-router";
import TopBar from "@/components/TopBar/TopBar";
import { CategoryProvider } from "@/context/CategoryContext";
import { ChapterProvider } from "@/context/ChapterContext";
import { MenuBar } from "@/components/MenuBar";

const TabsLayout = () => {
  return (
    <CategoryProvider>
      <ChapterProvider>
        <Tabs screenOptions={{ sceneStyle: { backgroundColor: "white" } }} tabBar={(props) => <MenuBar {...props} />}>
          <Tabs.Screen name="dashboard" options={{ title: "Dashboard", header: () => <TopBar pageType="dashboard" /> }} />
          <Tabs.Screen name="leaderboard" options={{ title: "Leaderboard", header: () => <TopBar pageType="leaderboard" /> }} />
          <Tabs.Screen name="forums" options={{ headerShown: false }} />
          <Tabs.Screen name="profile" options={{ title: "Profile", header: () => <TopBar pageType="profile" /> }} />
        </Tabs>
      </ChapterProvider>
    </CategoryProvider>
  );
};

export default TabsLayout;
