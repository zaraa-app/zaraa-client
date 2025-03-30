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

const correctMessages = ["Amazing!", "Well done!", "You're on fire!", "Great job!", "Perfect!"];
const incorrectMessages = ["Oops!", "Not quite.", "Almost!", "Try again next time!", "Incorrect."];

const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({ isCorrect, message, explanation, correctAnswer, onNext }) => {
  const randomMessage = useMemo(() => {
    if (message) return message;
    const list = isCorrect ? correctMessages : incorrectMessages;
    return list[Math.floor(Math.random() * list.length)];
  }, [isCorrect, message]);

  return (
    <View className="absolute h-full w-full items-center justify-end bg-black/30">
      <View className="w-full rounded-t-3xl bg-white p-6 pt-4">
        {/* Header Row */}
        <View className="mb-1 flex-row items-center gap-1">
          <FontAwesome name={isCorrect ? "check-circle" : "times-circle"} size={16} color={isCorrect ? "#6BBE51" : "#D5001B"} />
          <Text className={`font-bold ${isCorrect ? "text-primary-300" : "text-red-200"}`}>{randomMessage}</Text>
        </View>

        {/* Explanation Text */}
        <Text className="mb-3 text-sm text-black">
          <Text className="font-bold">{isCorrect ? "Well Done! " : "Correct Answer: "}</Text>
          {isCorrect ? explanation : correctAnswer}
        </Text>

        <ActionButton
          title={isCorrect ? "Continue" : "Got it"}
          onPress={onNext}
          intent={isCorrect ? "primary" : "tertiary"}
          className={!isCorrect ? "border border-red-200 bg-red-200" : ""}
          isOutline={!isCorrect}
          style={!isCorrect ? { borderColor: "#D5001B" } : {}}
        />
      </View>
    </View>
  );
};

export default AnswerFeedback;
