import React, { useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, Image } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import AnswerFeedback from "@/components/QuizComponents/AnswerFeedback";
import AnswerOption from "@/components/QuizComponents/AnswerOption";

const QuizPage = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const options = [
    { letter: "A", text: "Moist and clay-like soil" },
    { letter: "B", text: "Well-draining sandy soil" }, // ✅ correct
    { letter: "C", text: "Fertile" },
    { letter: "D", text: "Soil with lots of organic matter" },
  ];

  const correctAnswer = "B";

  const checkAnswer = () => {
    if (!selectedOption) return;
    setChecked(true);
    setIsCorrect(selectedOption === correctAnswer);
  };

  const resetFeedback = () => {
    setChecked(false);
    setSelectedOption(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-300">
      {/* Top Bar */}
      <View className="flex-row items-center justify-between px-4 pt-2">
        <TouchableOpacity className="rounded-full bg-white p-2">
          <FontAwesome6 name="arrow-left" size={16} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white">Question 1/5</Text>
        <View className="flex-row items-center gap-1">
          <FontAwesome6 name="heart" color="white" size={16} />
          <Text className="text-base font-semibold text-white">5</Text>
        </View>
      </View>

      {/* Main White Container */}
      <View className="mx-4 mt-6 flex-1 rounded-3xl bg-white p-4">
        {/* Question */}
        <Text className="mb-4 text-center text-lg font-bold text-neutral-1000">What type of soil is best for cacti?</Text>

        {/* Image */}
        <View className="items-center justify-center rounded-xl bg-gray-100 p-4">
          <Image source={{ uri: "https://picsum.photos/536/354" }} className="h-40 w-full rounded-xl" resizeMode="cover" />
        </View>

        {/* Answer Options */}
        <View className="mt-6">
          {options.map((opt) => (
            <AnswerOption
              key={opt.letter}
              letter={opt.letter}
              text={opt.text}
              isCorrect={opt.letter === correctAnswer}
              selected={selectedOption === opt.letter}
              checked={checked}
              onPress={() => setSelectedOption(opt.letter)}
            />
          ))}
        </View>

        {/* Check Button */}
        <TouchableOpacity
          disabled={!selectedOption}
          onPress={checkAnswer}
          className={`mt-6 w-full items-center justify-center rounded-full py-3 ${selectedOption ? "bg-primary-300" : "bg-gray-300"}`}
        >
          <Text className="font-bold text-white">CHECK</Text>
        </TouchableOpacity>
      </View>

      {/* Answer Feedback */}
      {checked && (
        <AnswerFeedback
          isCorrect={isCorrect}
          correctAnswer={"Well-draining sandy soil"}
          explanation={"Cacti thrive in soil that drains quickly to prevent root rot."}
          onNext={resetFeedback}
        />
      )}
    </SafeAreaView>
  );
};

export default QuizPage;
