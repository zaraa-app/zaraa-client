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
        <Tabs
          screenOptions={{ sceneStyle: { backgroundColor: "white" } }}
          tabBar={({ state, ...rest }) => {
            const current = state.routeNames[state.index];
            if (current === "quiz/[lessonId]") return null;
            return <MenuBar state={state} {...rest} />;
          }}
        >
          <Tabs.Screen name="dashboard" options={{ title: "Dashboard", header: () => <TopBar pageType="dashboard" /> }} />
          <Tabs.Screen name="leaderboard" options={{ title: "Leaderboard", header: () => <TopBar pageType="leaderboard" /> }} />
          <Tabs.Screen name="forums" options={{ headerShown: false }} />
          <Tabs.Screen name="profile" options={{ title: "Profile", header: () => <TopBar pageType="profile" /> }} />
          <Tabs.Screen name="quiz/[lessonId]" options={{ headerShown: false }} />
        </Tabs>
      </ChapterProvider>
    </CategoryProvider>
  );
};

export default TabsLayout;
