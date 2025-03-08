import React, { useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { View } from "react-native";
import ChapterSelect from "@/components/ChapterSelect";
import LessonButton from "@/components/LessonButton";
import { LessonStatus } from "@/api/types/userLessonProgress.types";

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
      <View className="flex-1 items-center justify-center p-56">
        <LessonButton status={LessonStatus.Completed} />
      </View>
    </View>
  );
};

export default Dashboard;
