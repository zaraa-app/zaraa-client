import React, { useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { View } from "react-native";
import ChapterSelect from "@/components/ChapterSelect";
import LessonButton from "@/components/LessonButton";
import { LessonStatus } from "@/api/types/userLessonProgress.types";
import LessonInfo from "@/components/LessonInfo";
import styles from "@/utils/styles";

const Dashboard = () => {
  const { isLoggedIn } = useGlobalContext();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn]);

  return (
    <View className="flex-1" style={[styles.pb6]}>
      <ChapterSelect />
      <View className="flex-1 flex-row items-center justify-center gap-4">
        <LessonButton status={LessonStatus.Completed} />
        <LessonButton status={LessonStatus.InProgress} />
        <LessonButton status={LessonStatus.Locked} />
      </View>
      <LessonInfo />
    </View>
  );
};

export default Dashboard;
