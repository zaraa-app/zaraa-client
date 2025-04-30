import React, { useEffect, useState, useCallback } from "react";
import { View, Image, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Heart from "@/assets/icons/heart.svg";

import AnswerOption from "@/components/QuizComponents/AnswerOption";
import AnswerFeedback from "@/components/QuizComponents/AnswerFeedback";
import ProgressBar from "@/components/ProgressBar";
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

const index = Math.floor(Math.random() * victoryTitles.length);
const victoryTitle = victoryTitles[index];
const victorySubtitle = victorySubtexts[index];

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

  const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState(false);
  const [retryQueue, setRetryQueue] = useState<LessonQuestionResponse[]>([]);
  const [retryMode, setRetryMode] = useState(false);

  useEffect(() => {
    (async () => {
      const currentLesson = await getLessonById(lessonId);

      if (!currentLesson) {
        router.back();
        return;
      }

      setLesson(currentLesson);

      const questions = await getLessonQuestions(lessonId);
      if (questions?.length) {
        const sorted = questions.sort((a, b) => a.index - b.index);
        setQuestions(sorted);
        setCurrentIndex(0);
      }
      setIsLoading(false);
    })();
  }, [lessonId]);

  const handleAction = useCallback(async () => {
    const currentList = retryMode ? retryQueue : questions;
    const currentQuestion = currentList[currentIndex];
    const correctText = currentQuestion.options.find((option) => option.isCorrect)?.answerText;
    const isCorrect = selectedOption === correctText;

    if (!checked) {
      setChecked(true);
      if (isCorrect) {
        setCorrectAnswers((count) => count + 1);
      } else {
        // Call an api to decrement hearts
        const updatedUserHearts = await decrementHearts(user);

        if (updatedUserHearts) {
          setUser(updatedUserHearts);

          if (updatedUserHearts.hearts <= 0) {
            setShowOutOfHeartsModal(true);
          }
        }

        setRetryQueue((prev) => [...prev, currentQuestion]);
      }
      return;
    }

    const isLastQuestion = currentIndex + 1 === currentList.length;

    if (!isLastQuestion) {
      setCurrentIndex((index) => index + 1);
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
  }, [checked, currentIndex, selectedOption, questions, retryQueue, retryMode, correctAnswers]);

  const handleFinishQuiz = async () => {
    const updatedUserWithXp = await addXp(user, lesson?.xpValue ?? 0);

    if (updatedUserWithXp) {
      setUser(updatedUserWithXp);
    }

    if (!user) return;

    await updateUserLessonProgress(user.$id, lessonId);
    router.push("/dashboard");
  };

  if (isLoading) return <PageLoader pageType="quiz/[lessonId]" />;

  const currentList = retryMode ? retryQueue : questions;
  const total = currentList.length;
  const current = currentList[currentIndex];
  const correctText = current?.options.find((option) => option.isCorrect)?.answerText ?? "";
  const isLast = currentIndex + 1 === total;
  const buttonTitle =
    !checked ? "Check Answer"
    : isLast && retryMode ? "Finish"
    : isLast ? "Retry Mistakes"
    : "Next Question";

  if (quizComplete || questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white px-6 pt-8">
        <View className="flex-1 items-center justify-center">
          <Image
            source={{ uri: "https://picsum.photos/200/200" }} // placeholder
            className="h-72 w-72"
            resizeMode="contain"
          />
          <TextContent text={victoryTitle} size="xl" className="mb-2 mt-4 text-center font-extrabold text-neutral-1000" />
          <TextContent text={victorySubtitle} className="mb-4 text-center text-neutral-800" />
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
      {showOutOfHeartsModal && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-black/50 px-8">
          <View className="w-full items-center rounded-2xl bg-white p-6 shadow-xl">
            <TextContent text="You're out of hearts 💔" size="lg" className="mb-2 text-center font-bold" />
            <TextContent
              text="You need more hearts to continue this lesson. Come back later or earn more to try again!"
              className="mb-4 text-center text-gray-600"
            />
            <ActionButton title="Go Back" onPress={() => router.back()} className="w-full" />
          </View>
        </View>
      )}
      <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-primary-300 px-4 py-4">
        <View className="flex-1 gap-4 rounded-3xl bg-white p-4">
          <View className="flex-row items-center justify-between gap-2">
            <Ionicons name="close" size={24} color="#374151" onPress={() => router.back()} />
            <ProgressBar progress={correctAnswers / questions.length} />
            <View className="flex-row items-center gap-1">
              <Heart width={24} height={24} />
              <TextContent text={user?.hearts.toString()} className="text-center font-bold" />
            </View>
          </View>

          <TextContent size="lg" text={current.questionText} className="text-center font-bold" />

          {current.questionImage && (
            <Image
              source={{
                uri: current.questionImage.toString().replace("/preview", "/view"),
              }}
              className="my-2 h-1/4 w-full rounded-xl"
              resizeMode="contain"
            />
          )}

          <View className="flex-1 justify-between">
            {current.options.map((opt, i) => (
              <AnswerOption
                key={i}
                letter={String.fromCharCode(65 + i)}
                text={opt.answerText}
                isCorrect={opt.isCorrect}
                selected={selectedOption === opt.answerText}
                checked={checked}
                onPress={() => !checked && setSelectedOption(opt.answerText)}
              />
            ))}
          </View>

          <ActionButton title={buttonTitle} onPress={handleAction} disabled={!selectedOption && !checked} />
        </View>

        <StatusBar style="light" />
      </SafeAreaView>
    </View>
  );
}
