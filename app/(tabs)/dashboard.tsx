import React, { useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { View } from "react-native";
import ChapterSelect from "@/components/ChapterSelect";
import LessonButton from "@/components/LessonButton";
import { ELessonStatus } from "@/api/types/userLessonProgress.types";
import LessonInfo from "@/components/LessonInfo/LessonInfo";
import styles from "@/utils/styles";
import { ELessonDifficulty } from "@/api/types/lesson.types";
import normalize from "@/utils/normalize";

const Dashboard = () => {
  const { isLoggedIn } = useGlobalContext();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn]);

  return (
    <View className="flex-1" style={[styles.pb6, { marginBottom: normalize(92) }]}>
      <ChapterSelect />
      <View className="flex-1 flex-row items-center justify-center gap-4">
        <LessonButton status={ELessonStatus.Completed} />
        <LessonButton status={ELessonStatus.InProgress} />
        <LessonButton status={ELessonStatus.Locked} />
      </View>
      <LessonInfo
        title={"Test Title Something Something"}
        content={"Some content here to fill up the data."}
        difficulty={ELessonDifficulty.Easy}
        avgTime={0}
        xpValue={100}
        status={ELessonStatus.Completed}
        onPress={() => {
          console.error("Function not implemented.");
        }}
      />
    </View>
  );
};

export default Dashboard;
