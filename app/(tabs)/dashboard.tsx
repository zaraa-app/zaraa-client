import React, { useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { View } from "react-native";
import TextContent from "@/components/TextContent";
import { useCategory } from "@/context/CategoryContext";
import ChapterSelect from "@/components/ChapterSelect";

const Dashboard = () => {
  const { isLoggedIn } = useGlobalContext();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn]);

  return (
    <View>
      <ChapterSelect />
    </View>
  );
};

export default Dashboard;
