import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AnswerOption from "@/components/QuizComponents/AnswerOption";

const Quiz: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const handleSelect = (letter: string) => {
    setSelectedLetter(letter);
    setChecked(false); // reset checked state on new selection
  };

  const handleCheck = () => {
    setChecked(true);
  };

  return (
    <View className="p-6">
      <Text className="text-lg font-bold mb-4">Question: What type of soil is best for basil?</Text>

      <AnswerOption
        letter="A"
        text="Moist and clay-like soil"
        isCorrect={true}
        selected={selectedLetter === "A"}
        checked={checked}
        onPress={() => handleSelect("A")}
      />
      <AnswerOption
        letter="B"
        text="Dry and sandy soil"
        isCorrect={false}
        selected={selectedLetter === "B"}
        checked={checked}
        onPress={() => handleSelect("B")}
      />

      {/* Check Button */}
      <TouchableOpacity
        onPress={handleCheck}
        disabled={!selectedLetter}
        className={`mt-4 p-4 rounded-full items-center ${
          selectedLetter ? "bg-primary-300" : "bg-gray-400"
        }`}
      >
        <Text className="text-white font-bold">CHECK</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Quiz;
