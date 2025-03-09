import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import ChapterSelect from "@/components/ChapterSelect";
import LessonButton from "@/components/LessonButton";
import { ELessonStatus, UserLessonProgressResponse } from "@/api/types/userLessonProgress.types";
import LessonInfo from "@/components/LessonInfo/LessonInfo";
import styles from "@/utils/styles";
import { ELessonDifficulty, LessonResponse } from "@/api/types/lesson.types";
import normalize from "@/utils/normalize";
import { useCategory } from "@/context/CategoryContext";
import { getLessonsByCategory } from "@/api/services/lesson.service";
import { getUserLessonProgress } from "@/api/services/userLessonProgress.service";

const Dashboard = () => {
  const { isLoggedIn, user } = useGlobalContext();
  const { selectedCategory } = useCategory();

  const [allLessons, setAllLessons] = useState<LessonResponse[]>([]);
  const [allUserProgress, setAllUserProgress] = useState<UserLessonProgressResponse[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!selectedCategory || !user) {
      return;
    }

    const fetchAllLessons = async () => {
      const categoryLessons = await getLessonsByCategory(selectedCategory.$id);
      setAllLessons(categoryLessons);

      const userProgress = await getUserLessonProgress(user.$id);
      setAllUserProgress(userProgress);
    };

    fetchAllLessons();
  }, [selectedCategory, user]);

  const getLessonStatus = (lessonId: string, index: number) => {
    const progress = allUserProgress.find((progress) => progress.lesson.$id === lessonId);
    if (progress) {
      return progress.status;
    }
    const lastCompletedIndex = allUserProgress.findIndex((progress) => progress.status === ELessonStatus.Completed);

    if (index === lastCompletedIndex + 1) {
      return ELessonStatus.InProgress;
    }

    return ELessonStatus.Locked;
  };

  return (
    <View className="flex-1" style={[styles.pb6, { marginBottom: normalize(92) }]}>
      <ChapterSelect />
      <ScrollView horizontal contentContainerClassName="items-center" showsHorizontalScrollIndicator={false} style={[styles.px6]}>
        {allLessons.map((lesson, index) => (
          <LessonButton
            key={lesson.$id}
            lesson={lesson}
            status={getLessonStatus(lesson.$id, index)}
            style={{ marginTop: index % 2 !== 0 ? normalize(100) : normalize(-100) }}
          />
        ))}
      </ScrollView>
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
