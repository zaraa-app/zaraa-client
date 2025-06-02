import React, { useState, useCallback, useMemo } from "react";
import { View, Image, Text } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import AnswerFeedback from "@/components/QuizComponents/AnswerFeedback";
import ActionButton from "@/components/ActionButton";
import TextContent from "@/components/TextContent";
import PageLoader from "@/components/PageLoader/PageLoader";

import { getLessonQuestions } from "@/api/services/lessonQuestions.service";
import { LessonQuestionResponse } from "@/api/types/lessonQuestions.types";
import { useGlobalContext } from "@/context/GlobalProvider";
import { addXp, decrementHearts } from "@/api/services/user.service";
import { LessonResponse } from "@/api/types/lesson.types";
import { getLessonById } from "@/api/services/lesson.service";
import { updateUserLessonProgress } from "@/api/services/userLessonProgress.service";
import OutOfHeartsModal from "@/components/QuizComponents/OutOfHeartsModal";
import QuizHeader from "@/components/QuizComponents/QuizHeader";
import QuizQuestion from "@/components/QuizComponents/QuizQuestion";
import ExitQuizModal from "@/components/QuizComponents/ExitQuizModal";

const victoryTitles = [
  "Cactus-tastic! 🌟",
  "You’ve Bloomed! 🌼",
  "Rooted in Success 🌱",
  "Unbe-leaf-able Work! 🍃",
  "Thorn to Be Wild 🌵",
  "You Grow, Girl! 🌻",
  "Full Sun Champion ☀️",
  "Photosynthesized to Perfection 🌿",
  "Garden Guardian 🌺",
  "Succulent Superstar 💚",
];

const victorySubtexts = [
  "You’re on point! Another lesson down, and you’re looking sharp!",
  "You kept growing — even when things got prickly.",
  "That lesson didn’t stand a chance against your green thumb.",
  "You sprouted knowledge like a pro!",
  "Keep this up and you'll be blooming in no time.",
  "You really rooted that one! Time to branch out to the next.",
  "Even the toughest soil couldn’t stop you!",
  "Your learning game is thriving — just like a well-watered Monstera.",
  "No wilted effort here — just full-on flourish mode!",
  "That was *mint*. Ready to leaf into the next lesson?",
];

export default function LessonQuiz() {
  const { user, setUser } = useGlobalContext();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const [lesson, setLesson] = useState<LessonResponse | null>(null);
  const [questions, setQuestions] = useState<LessonQuestionResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [quizComplete, setQuizComplete] = useState(false);

  const [showExitModal, setShowExitModal] = useState(false);
  const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState(false);
  const [retryQueue, setRetryQueue] = useState<LessonQuestionResponse[]>([]);
  const [retryMode, setRetryMode] = useState(false);

  const { image, title, subtitle } = useMemo(() => {
    const index = Math.floor(Math.random() * victoryTitles.length);
    const imageIndex = Math.floor(Math.random() * 10) + 1; // 1 to 10
    return {
      title: victoryTitles[index],
      subtitle: victorySubtexts[index],
      image: `@/assets/images/LessonCompletion/${imageIndex}.png`,
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        setIsLoading(true);

        const currentLesson = await getLessonById(lessonId);
        const lessonQuestions = await getLessonQuestions(lessonId);
        const sorted = lessonQuestions?.sort((a, b) => a.index - b.index) ?? [];

        if (isActive) {
          if (!currentLesson) {
            router.back();
            return;
          }

          setLesson(currentLesson);
          setQuestions(sorted);
          setCurrentIndex(0);
          setSelectedOption(null);
          setChecked(false);
          setCorrectAnswers(0);
          setRetryQueue([]);
          setRetryMode(false);
          setQuizComplete(false);
          setIsLoading(false);
        }
      })();

      return () => {
        isActive = false;
      };
    }, [lessonId])
  );

  const handleAction = useCallback(async () => {
    const currentList = retryMode ? retryQueue : questions;
    const currentQuestion = currentList[currentIndex];
    const correctText = currentQuestion.options.find((o) => o.isCorrect)?.answerText;
    const isCorrect = selectedOption === correctText;

    if (!checked) {
      setChecked(true);
      if (isCorrect) {
        setCorrectAnswers((prev) => prev + 1);
      } else {
        const updatedUser = await decrementHearts(user);
        if (updatedUser) {
          setUser(updatedUser);
          if (updatedUser.hearts <= 0) setShowOutOfHeartsModal(true);
        }
        setRetryQueue((prev) => [...prev, currentQuestion]);
      }
      return;
    }

    const isLast = currentIndex + 1 === currentList.length;
    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setChecked(false);
      return;
    }

    if (!retryMode && retryQueue.length > 0) {
      setRetryMode(true);
      setCurrentIndex(0);
      setSelectedOption(null);
      setChecked(false);
      return;
    }

    if (retryMode && retryQueue.length > currentIndex + 1) {
      setRetryQueue((prev) => [...prev.slice(currentIndex + 1)]);
      setCurrentIndex(0);
      setSelectedOption(null);
      setChecked(false);
      return;
    }

    setQuizComplete(true);
  }, [checked, currentIndex, selectedOption, questions, retryQueue, retryMode]);

  const handleFinishQuiz = async () => {
    if (!user) return;
    const updatedUser = await addXp(user, lesson?.xpValue ?? 0);
    if (updatedUser) setUser(updatedUser);

    await updateUserLessonProgress(user.$id, lessonId);
    setIsLoading(true);
    setSelectedOption(null);
    setChecked(false);
    setCorrectAnswers(0);
    setRetryQueue([]);
    setRetryMode(false);
    setCurrentIndex(0);
    setQuizComplete(false);
    router.push("/dashboard");
  };

  const handleConfirmExit = () => {
    setSelectedOption(null);
    setChecked(false);
    setCorrectAnswers(0);
    setRetryQueue([]);
    setRetryMode(false);
    setCurrentIndex(0);
    setQuizComplete(false);
    setShowExitModal(false);
    router.back();
  };

  if (isLoading) return <PageLoader pageType="quiz/[lessonId]" />;

  const currentList = retryMode ? retryQueue : questions;
  const current = currentList[currentIndex];
  const correctText = current?.options.find((o) => o.isCorrect)?.answerText ?? "";
  const isLast = currentIndex + 1 === currentList.length;

  const buttonTitle =
    !checked ? "Check Answer"
    : isLast && retryMode ? "Finish"
    : isLast ? "Retry Mistakes"
    : "Next Question";

  if (quizComplete || questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white px-6 pt-8">
        <View className="flex-1 items-center justify-center">
          <Image source={image} className="h-72 w-72" resizeMode="contain" />
          <TextContent text={title} size="xl" className="mb-2 mt-4 text-center font-extrabold text-neutral-1000" />
          <TextContent text={subtitle} className="mb-4 text-center text-neutral-800" />
          <View className="mb-6 w-full flex-row items-center justify-center gap-2 rounded-3xl bg-yellow-50 px-6 py-3">
            <Text>⭐</Text>
            <Text className="text-2xl font-black text-yellow-800">{lesson?.xpValue} XP</Text>
          </View>
        </View>

        <View className="w-full pb-4">
          <ActionButton title="Keep Learning!" onPress={handleFinishQuiz} className="w-full" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="relative flex-1">
      {checked && <AnswerFeedback isCorrect={selectedOption === correctText} correctAnswer={correctText} onNext={handleAction} />}
      {showOutOfHeartsModal && <OutOfHeartsModal />}

      <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-primary-300 px-4 py-4">
        <View className="flex-1 gap-4 rounded-3xl bg-white p-4">
          <QuizHeader
            progress={correctAnswers / questions.length}
            hearts={user?.hearts ?? 0}
            onExitConfirm={() => setShowExitModal(true)}
          />

          <QuizQuestion question={current} selectedOption={selectedOption} checked={checked} onSelect={setSelectedOption} />

          <ActionButton title={buttonTitle} onPress={handleAction} disabled={!selectedOption && !checked} />
        </View>

        <StatusBar style="light" />
      </SafeAreaView>
      {showExitModal && <ExitQuizModal visible={showExitModal} onConfirm={handleConfirmExit} onCancel={() => setShowExitModal(false)} />}
    </View>
  );
}
