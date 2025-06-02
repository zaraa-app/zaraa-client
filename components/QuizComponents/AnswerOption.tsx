import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AnswerOptionProps {
  letter: string;
  text: string;
  isCorrect: boolean;
  selected: boolean;
  checked: boolean;
  onPress: () => void;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({ letter, text, isCorrect, selected, checked, onPress }: AnswerOptionProps) => {
  const getBackgroundColor = () => {
    if (checked && selected) {
      return isCorrect ? "#6BBE51" : "#D5001B"; // green or red after check
    }
    if (selected) return "#D7CFBC";
    return "#F4F1EC";
  };

  const getTextColor = () => {
    return checked && selected ? "#FFFFFF" : "#000000";
  };

  const getIconName = () => {
    if (checked && selected) {
      return isCorrect ? "checkmark-circle" : "close-circle";
    }
    return selected ? "ellipse" : "ellipse-outline";
  };

  const getIconColor = () => {
    if (checked && selected) return "#FFFFFF";
    return selected ? "#B29F79" : "#D9CFBA";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="elevation-2 my-2 w-full flex-1 flex-row items-center justify-between rounded-xl border border-secondary-200 p-4 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.25)]"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <View className="flex-1 flex-row items-center">
        <Text className="mr-4 font-bold" style={{ color: getTextColor() }}>
          {letter}
        </Text>
        <Text style={{ color: getTextColor() }}>{text}</Text>
      </View>
      <View className="ml-2">
        <Ionicons name={getIconName()} size={20} color={getIconColor()} />
      </View>
    </TouchableOpacity>
  );
};

export default AnswerOption;
