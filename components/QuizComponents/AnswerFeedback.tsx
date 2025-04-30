import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import ActionButton from "@/components/ActionButton";

interface AnswerFeedbackProps {
  isCorrect: boolean;
  message?: string;
  explanation?: string;
  correctAnswer?: string;
  onNext: () => void;
}

const correctMessages = ["Amazing!", "You're on fire!", "Great job!", "Perfect!"];
const incorrectMessages = ["Oops!", "Not quite.", "Almost!", "Try again next time!", "Incorrect."];

const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({ isCorrect, message, explanation, correctAnswer, onNext }) => {
  const randomMessage = useMemo(() => {
    if (message) return message;
    const list = isCorrect ? correctMessages : incorrectMessages;
    return list[Math.floor(Math.random() * list.length)];
  }, [isCorrect, message]);

  return (
    <View className="absolute inset-0 z-50 h-full w-full items-center justify-end bg-black/20">
      <View className="w-full rounded-t-3xl bg-white p-6 pt-4">
        <View className="mb-1 flex-row items-center gap-1">
          <FontAwesome name={isCorrect ? "check-circle" : "times-circle"} size={16} color={isCorrect ? "#6BBE51" : "#D5001B"} />
          <Text className={`font-bold ${isCorrect ? "text-primary-300" : "text-red-200"}`}>{randomMessage}</Text>
        </View>

        <Text className="mb-3 text-sm text-black">
          <Text className="font-bold">{isCorrect ? "The answer is indeed: " : "Correct Answer: "}</Text>
          {correctAnswer}
        </Text>

        <ActionButton title={isCorrect ? "Continue" : "Got it"} onPress={onNext} intent={isCorrect ? "primary" : "danger"} />
      </View>
    </View>
  );
};

export default AnswerFeedback;
