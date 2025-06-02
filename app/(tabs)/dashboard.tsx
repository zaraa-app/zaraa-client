import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { Animated, Dimensions, ScrollView, View, Image } from "react-native";
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
  const curtainTranslateY = useRef(new Animated.Value(-100)).current;
  const curtainOpacity = useRef(new Animated.Value(0)).current;
  const [showOutOfHeartsCurtain, setShowOutOfHeartsCurtain] = useState(false);

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

  const onLessonPress = (lesson: LessonResponse) => {
    if (user?.hearts && user.hearts > 0) {
      router.push("/quiz/" + selectedLesson.$id);
      return;
    }

    setShowOutOfHeartsCurtain(true);

    Animated.parallel([
      Animated.timing(curtainTranslateY, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(curtainOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(curtainTranslateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(curtainOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setShowOutOfHeartsCurtain(false));
    }, 3500);
  };

  if (isLoading) {
    return <PageLoader pageType="dashboard" />;
  }

  return (
    <>
      {showOutOfHeartsCurtain && (
        <Animated.View
          className="absolute left-0 right-0 top-0 z-50 items-center px-6 pb-4 pt-2"
          style={{
            transform: [{ translateY: curtainTranslateY }],
            opacity: curtainOpacity,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingVertical: 14,
              paddingHorizontal: 16,
              width: "100%",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 6,
              alignItems: "center",
            }}
          >
            <TextContent text="You're out of hearts 💔" size="lg" className="mb-1 text-center font-bold text-red-600" />
            <TextContent text="Come back later or earn more to start this lesson." className="text-center text-gray-600" />
          </View>
        </Animated.View>
      )}
      <Animated.View className="flex-1" style={[styles.pb6, { marginBottom: normalize(92), opacity: fadeAnim }]}>
        {lessons.length === 0 ?
          <View className="flex-1 items-center justify-center px-6">
            <Image
              source={require("@/assets/images/empty-lessons.png")}
              style={{ width: normalize(200), height: normalize(200), marginBottom: normalize(16) }}
              resizeMode="contain"
            />
            <TextContent size="xl" text="No Lessons Found" className="mb-2 text-center font-extrabold text-neutral-900" />
            <TextContent
              size="base"
              text="We couldn't find any lessons in this category. Try selecting another plant category!"
              className="mb-4 text-center text-neutral-600"
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
                  lessons.findIndex((existingLesson) => existingLesson.$id === selectedLesson.$id)
                )}
                onPress={() => onLessonPress(selectedLesson)}
              />
            )}
          </>
        }
      </Animated.View>
    </>
  );
};

export default Dashboard;
