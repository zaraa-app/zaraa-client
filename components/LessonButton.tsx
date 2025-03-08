import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import LockedLesson from "@/assets/icons/locked-lesson.svg";
import LockedLessonPressed from "@/assets/icons/locked-lesson-pressed.svg";
import InProgressLesson from "@/assets/icons/inprogress-lesson.svg";
import InProgressLessonPressed from "@/assets/icons/inprogress-lesson-pressed.svg";
import CompletedLesson from "@/assets/icons/completed-lesson.svg";
import CompletedLessonPressed from "@/assets/icons/completed-lesson-pressed.svg";
import { LessonStatus } from "@/api/types/userLessonProgress.types";
import * as Haptics from "expo-haptics";
import normalize from "@/utils/normalize";

interface LessonButtonProps {
  status?: LessonStatus;
  onPress?: () => void;
}

const lessonIcons = {
  [LessonStatus.Locked]: {
    normal: LockedLesson,
    pressed: LockedLessonPressed,
  },
  [LessonStatus.InProgress]: {
    normal: InProgressLesson,
    pressed: InProgressLessonPressed,
  },
  [LessonStatus.Completed]: {
    normal: CompletedLesson,
    pressed: CompletedLessonPressed,
  },
};

const LessonButton: React.FC<LessonButtonProps> = ({ status = LessonStatus.Locked, onPress }) => {
  const [isPressed, setIsPressed] = useState(false);

  const LessonIcon = isPressed ? lessonIcons[status].pressed : lessonIcons[status].normal;

  const handlePress = () => {
    Haptics.selectionAsync(); // Medium haptic feedback
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={handlePress}
      activeOpacity={0.95}
    >
      <LessonIcon height={normalize(88)} width={normalize(88)} />
    </TouchableOpacity>
  );
};

export default LessonButton;
