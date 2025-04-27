import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { Animated, Dimensions, ScrollView, View } from "react-native";
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
import TextContent from "@/components/TextContent";
import PageLoader from "@/components/PageLoader/PageLoader";
import { useChapter } from "@/context/ChapterContext";
import { ChapterResponse } from "@/api/types/chapter.types";

const Dashboard = () => {
  const { isLoggedIn, user } = useGlobalContext();
  const { selectedCategory } = useCategory();
  const { chapters, selectedChapter, setSelectedChapter } = useChapter();

  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [userProgress, setUserProgress] = useState<UserLessonProgressResponse[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<LessonResponse>({} as LessonResponse);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const scrollViewRef = useRef<ScrollView>(null);
  const lessonPositions = useRef<{ [key: string]: number }>({});
  const isProgrammaticScroll = useRef(false);
  const initialScrollDone = useRef(false);

  const screenCenter = Dimensions.get("window").width / 2;

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
      setIsLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };

    fetchAllLessons();
  }, [selectedCategory, user]);

  useEffect(() => {
    if (!initialScrollDone.current && lessons.length > 0 && selectedChapter) {
      const firstLesson = lessons.find((lesson) => lesson.chapter.$id === selectedChapter.$id);
      if (firstLesson && lessonPositions.current[firstLesson.$id] !== undefined) {
        scrollViewRef.current?.scrollTo({
          x: lessonPositions.current[firstLesson.$id],
          animated: false,
        });
        setSelectedLesson(firstLesson);
        initialScrollDone.current = true;
      }
    }
  }, [lessons, selectedChapter]);

  const handleLessonLayout = (lessonId: string) => (event: any) => {
    const { x } = event.nativeEvent.layout;
    lessonPositions.current[lessonId] = x;
  };

  const onScroll = (event: any) => {
    if (isProgrammaticScroll.current) return;

    const scrollX = event.nativeEvent.contentOffset.x;
    const threshold = scrollX + screenCenter;
    let newActiveChapter: ChapterResponse = {} as ChapterResponse;
    let maxX = -Infinity;

    chapters.forEach((chapter) => {
      const firstLesson = lessons.find((lesson) => lesson.chapter.$id === chapter.$id && lesson.index === 1);
      if (firstLesson && lessonPositions.current[firstLesson.$id] !== undefined) {
        const lessonX = lessonPositions.current[firstLesson.$id];
        if (lessonX <= threshold && lessonX > maxX) {
          maxX = lessonX;
          newActiveChapter = chapter;
        }
        setSelectedLesson(firstLesson);
      }
    });

    if (Object.keys(newActiveChapter).length > 0 && selectedChapter?.$id !== newActiveChapter.$id) {
      setSelectedChapter(newActiveChapter);
    }
  };

  const onChapterSelect = (chapter: ChapterResponse) => {
    const firstLesson = lessons.find((lesson) => lesson.chapter.$id === chapter.$id);
    if (firstLesson && lessonPositions.current[firstLesson.$id] !== undefined) {
      isProgrammaticScroll.current = true;
      scrollViewRef.current?.scrollTo({
        x: lessonPositions.current[firstLesson.$id],
        animated: true,
      });
      setSelectedLesson(firstLesson);
    }
    setSelectedChapter(chapter);
  };

  const onMomentumScrollEnd = () => {
    isProgrammaticScroll.current = false;
  };

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

  if (isLoading) {
    return <PageLoader pageType="dashboard" />;
  }

  return (
    <Animated.View className="flex-1" style={[styles.pb6, { marginBottom: normalize(92), opacity: fadeAnim }]}>
      {lessons.length === 0 ?
        <View className="flex-1 items-center justify-center">
          <TextContent
            size="lg"
            text="No lessons found..."
            className="rounded-full bg-primary-300 font-bold italic text-white"
            style={[styles.p8]}
          />
        </View>
      : <>
          <ChapterSelect onSelect={onChapterSelect} />
          <ScrollView
            ref={scrollViewRef}
            horizontal
            onScroll={onScroll}
            onMomentumScrollEnd={onMomentumScrollEnd}
            scrollEventThrottle={16}
            contentContainerClassName="items-center"
            showsHorizontalScrollIndicator={false}
            style={[styles.px6]}
          >
            {lessons.map((lesson, index) => (
              <LessonButton
                key={lesson.$id}
                lesson={lesson}
                status={getLessonStatus(lesson.$id, index)}
                style={{ marginTop: index % 2 !== 0 ? normalize(100) : normalize(-100) }}
                onPress={setSelectedLesson}
                onLayout={handleLessonLayout(lesson.$id)}
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
                router.push("/quiz/" + selectedLesson.$id);
              }}
            />
          )}
        </>
      }
    </Animated.View>
  );
};

export default Dashboard;
