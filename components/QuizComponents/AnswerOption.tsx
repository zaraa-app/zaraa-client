import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

interface AnswerOptionProps {
  letter: string;
  text: string;
  isCorrect: boolean;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({ letter, text, isCorrect }) => {
  const [selected, setSelected] = useState(false);

  const handlePress = () => {
    setSelected(true);
  };

  return (
    <TouchableOpacity
    onPress={handlePress}
    className={`flex-row items-center p-4 rounded-xl w-full mb-3 ${
      selected ? (isCorrect ? "bg-primary-300" : "bg-red-500") : ""
    }`}
    style={{ backgroundColor: selected ? (isCorrect ? "#6BBE51" : "#D5001B") : "#F4F1EC" }} // Updated color
    >
    <FontAwesome6
      name={selected ? (isCorrect ? "check-circle" : "times-circle") : "circle"}
      size={20}
      color={selected ? "#FFFFFF" : "#0D355B"} // White when selected, Dark Blue when not
      style={{ marginRight: 12 }} // Adds spacing
    />
      <Text className={`font-bold mr-4 ${selected ? "text-white" : "text-black"}`}>{letter}</Text>
      <Text className={`flex-1 ${selected ? "text-white" : "text-black"}`}>{text}</Text>
    </TouchableOpacity>
  );
};

export default AnswerOption;
