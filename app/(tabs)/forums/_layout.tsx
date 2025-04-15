import { Stack } from "expo-router";
import TopBar from "@/components/TopBar/TopBar";

export default function ForumsLayout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: "white" } }}>
      <Stack.Screen name="index" options={{ header: () => <TopBar pageType="forums" /> }} />
      <Stack.Screen name="[forumId]" options={{ header: () => <TopBar pageType="forums" /> }} />
    </Stack>
  );
}
