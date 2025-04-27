import React, { useEffect, useState, useCallback } from "react";
import { View, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import AnswerOption from "@/components/QuizComponents/AnswerOption";
import AnswerFeedback from "@/components/QuizComponents/AnswerFeedback";
import ProgressBar from "@/components/ProgressBar";
import ActionButton from "@/components/ActionButton";
import TextContent from "@/components/TextContent";
import PageLoader from "@/components/PageLoader/PageLoader";

import { getLessonQuestions } from "@/api/services/lessonQuestions.service";
import { LessonQuestionResponse } from "@/api/types/lessonQuestions.types";

export default function LessonQuiz() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const [questions, setQuestions] = useState<LessonQuestionResponse[]>([]);
  const [currentQ, setCurrentQ] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const qs = await getLessonQuestions(lessonId);
      if (qs?.length) {
        const sorted = qs.sort((a, b) => a.index - b.index);
        setQuestions(sorted);
        setCurrentQ(sorted[0].index);
      }
      setIsLoading(false);
    })();
  }, [lessonId]);

  const handleAction = useCallback(() => {
    const total = questions.length;
    const current = questions[currentQ - 1];
    const correctText = current.options.find((o) => o.isCorrect)?.answerText;
    const isCorrect = selectedOption === correctText;

    if (!checked) {
      setChecked(true);
      if (isCorrect) setCorrectAnswers((c) => c + 1);
      return;
    }

    if (currentQ < total) {
      setCurrentQ((q) => q + 1);
      setSelectedOption(null);
      setChecked(false);
      return;
    }
  }, [checked, currentQ, questions, selectedOption, correctAnswers, lessonId]);

  if (isLoading) return <PageLoader pageType="quiz/[lessonId]" />;

  const total = questions.length;
  const current = questions[currentQ - 1];
  const correctText = current.options.find((o) => o.isCorrect)?.answerText;
  const isLast = currentQ === total;
  const buttonTitle =
    !checked ? "Check Answer"
    : isLast ? "Submit"
    : "Next Question";

  return (
    <View className="relative flex-1">
      {checked && <AnswerFeedback isCorrect={selectedOption === correctText} correctAnswer={correctText} onNext={handleAction} />}

      <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-primary-300 px-4 pt-4">
        <View className="flex-1 gap-4 rounded-3xl bg-white p-4">
          <View className="flex-row items-center justify-between gap-2">
            <Ionicons name="close" size={24} color="#374151" onPress={() => router.back()} />
            <ProgressBar progress={correctAnswers / total} />
          </View>

          <TextContent size="lg" text={current.questionText} className="text-center font-bold" />

          {current.questionImage && (
            <Image
              source={{
                uri: current.questionImage.toString().replace("/preview", "/view"),
              }}
              className="my-2 h-1/3 w-full rounded-xl"
              resizeMode="cover"
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
