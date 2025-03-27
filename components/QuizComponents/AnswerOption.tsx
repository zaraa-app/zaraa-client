import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCircle as faSolidCircle,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle, faCircle as faRegularCircle, faTimesCircle } from "@fortawesome/free-regular-svg-icons";

interface AnswerOptionProps {
  letter: string;
  text: string;
  isCorrect: boolean;
  selected: boolean;
  checked: boolean;
  onPress: () => void;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({
  letter,
  text,
  isCorrect,
  selected,
  checked,
  onPress,
}) => {
  const getBackgroundColor = () => {
    if (checked && selected) {
      return isCorrect ? "#6BBE51" : "#D5001B"; // green or red after check
    }
    if (selected) {
      return "#D7CFBC"; // highlighted on select
    }
    return "#F4F1EC"; // default
  };

  const getTextColor = () => {
    if (checked && selected) return "#FFFFFF";
    return "#000000";
  };

  const getIcon = () => {
    if (checked && selected) {
      return isCorrect ? faCheckCircle : faTimesCircle;
    }
    return selected ? faSolidCircle : faRegularCircle;
  };

  const getIconColor = () => {
    if (checked && selected) {
      return "#FFFFFF";
    }
    return selected ? "#B29F79" : "#0D355B";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row items-center justify-between p-4 rounded-xl w-full mb-3"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      {/* Left: Letter + Text */}
      <View className="flex-row items-center flex-1">
        <Text className="font-bold mr-4" style={{ color: getTextColor() }}>
          {letter}
        </Text>
        <Text style={{ color: getTextColor() }}>{text}</Text>
      </View>

      {/* Right: Icon */}
      <View className="ml-2">
        <FontAwesomeIcon icon={getIcon()} size={20} color={getIconColor()} />
      </View>
    </TouchableOpacity>
  );
};

export default AnswerOption;
