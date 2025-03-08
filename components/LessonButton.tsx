import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import LockedLesson from "@/assets/icons/locked-lesson.svg";
import LockedLessonPressed from "@/assets/icons/locked-lesson-pressed.svg";
import InProgressLesson from "@/assets/icons/inprogress-lesson.svg";
import InProgressLessonPressed from "@/assets/icons/inprogress-lesson-pressed.svg";
import CompletedLesson from "@/assets/icons/completed-lesson.svg";
import CompletedLessonPressed from "@/assets/icons/completed-lesson-pressed.svg";
import { ELessonStatus } from "@/api/types/userLessonProgress.types";
import * as Haptics from "expo-haptics";
import normalize from "@/utils/normalize";

interface LessonButtonProps {
  status?: ELessonStatus;
  onPress?: () => void;
}

const lessonIcons = {
  [ELessonStatus.Locked]: {
    normal: LockedLesson,
    pressed: LockedLessonPressed,
  },
  [ELessonStatus.InProgress]: {
    normal: InProgressLesson,
    pressed: InProgressLessonPressed,
  },
  [ELessonStatus.Completed]: {
    normal: CompletedLesson,
    pressed: CompletedLessonPressed,
  },
};

const LessonButton: React.FC<LessonButtonProps> = ({ status = ELessonStatus.Locked, onPress }) => {
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
      style={{ height: normalize(88), width: normalize(88) }}
    >
      <LessonIcon height={normalize(88)} width={normalize(88)} />
    </TouchableOpacity>
  );
};

export default LessonButton;
