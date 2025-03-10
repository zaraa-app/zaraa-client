import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import ChapterSelect from "@/components/ChapterSelect";
import LessonButton from "@/components/LessonButton";
import { ELessonStatus, UserLessonProgressResponse } from "@/api/types/userLessonProgress.types";
import LessonInfo from "@/components/LessonInfo/LessonInfo";
import styles from "@/utils/styles";
import { LessonResponse } from "@/api/types/lesson.types";
import normalize from "@/utils/normalize";
import { useCategory } from "@/context/CategoryContext";
import { getLessonsByCategory } from "@/api/services/lesson.service";
import { getUserLessonProgress } from "@/api/services/userLessonProgress.service";

const Dashboard = () => {
  const { isLoggedIn, user } = useGlobalContext();
  const { selectedCategory } = useCategory();

  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [userProgress, setUserProgress] = useState<UserLessonProgressResponse[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<LessonResponse>({} as LessonResponse);

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
      setLessons(categoryLessons);
      setSelectedLesson(categoryLessons[0]);

      const userProgress = await getUserLessonProgress(user.$id);

      const filteredProgress = userProgress.filter((progress) => categoryLessons.some((lesson) => lesson.$id === progress.lesson.$id));

      setUserProgress(filteredProgress);
    };

    fetchAllLessons();
  }, [selectedCategory, user]);

  const getLessonStatus = (lessonId: string, index: number) => {
    if (userProgress.length === 0) {
      return index === 0 ? ELessonStatus.InProgress : ELessonStatus.Locked;
    }

    const completedIndexes = lessons
      .map((lesson, idx) => ({
        index: idx,
        progress: userProgress.find((progress) => progress.lesson.$id === lesson.$id)?.status,
      }))
      .filter((item) => item.progress === ELessonStatus.Completed)
      .map((item) => item.index);

    const lastCompletedIndex = completedIndexes.length > 0 ? Math.max(...completedIndexes) : -1;

    if (index === lastCompletedIndex + 1) {
      return ELessonStatus.InProgress;
    }

    const progress = userProgress.find((progress) => progress.lesson.$id === lessonId);

    if (progress) {
      return progress.status;
    }

    return ELessonStatus.Locked;
  };

  return (
    <View className="flex-1" style={[styles.pb6, { marginBottom: normalize(92) }]}>
      <ChapterSelect />
      <ScrollView horizontal contentContainerClassName="items-center" showsHorizontalScrollIndicator={false} style={[styles.px6]}>
        {lessons.map((lesson, index) => (
          <LessonButton
            key={lesson.$id}
            lesson={lesson}
            status={getLessonStatus(lesson.$id, index)}
            style={{ marginTop: index % 2 !== 0 ? normalize(100) : normalize(-100) }}
            onPress={setSelectedLesson}
          />
        ))}
      </ScrollView>
      {selectedLesson && (
        <LessonInfo
          title={selectedLesson.title}
          content={selectedLesson.content}
          difficulty={selectedLesson.difficulty}
          avgTime={selectedLesson.avgTime}
          xpValue={selectedLesson.xpValue}
          status={getLessonStatus(
            selectedLesson.$id,
            lessons.findIndex((l) => l.$id === selectedLesson.$id)
          )}
          onPress={() => {
            console.error("Function not implemented.");
          }}
        />
      )}
    </View>
  );
};

export default Dashboard;
