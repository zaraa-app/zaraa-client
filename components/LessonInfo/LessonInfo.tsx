import { View, Text } from "react-native";
import React from "react";
import styles from "@/utils/styles";
import normalize from "@/utils/normalize";
import TextContent from "../TextContent";
import ActionButton from "../ActionButton";
import LessonDetail from "./LessonDetail";
import { ELessonDifficulty } from "@/api/types/lesson.types";
import { ELessonStatus } from "@/api/types/userLessonProgress.types";
import { cva } from "class-variance-authority";
import { selectionAsync } from "expo-haptics";

export interface LessonInfoProps {
  title: string;
  content: string;
  difficulty: ELessonDifficulty;
  avgTime: number;
  xpValue: number;
  status: ELessonStatus;
  onPress: () => void;
}

const LessonInfo = ({ status, title, content, difficulty, avgTime, xpValue, onPress }: LessonInfoProps) => {
  const wrapperStyle = cva("justify-between rounded-3xl", {
    variants: {
      status: {
        [ELessonStatus.Completed]: "bg-primary-300",
        [ELessonStatus.InProgress]: "bg-secondary-300",
        [ELessonStatus.Locked]: "bg-neutral-500",
      },
    },
  });

  const buttonStyle = cva("", {
    variants: {
      status: {
        [ELessonStatus.Completed]: "bg-primary-500",
        [ELessonStatus.InProgress]: "bg-secondary-500",
        [ELessonStatus.Locked]: "!bg-neutral-900",
      },
    },
  });

  const difficultyStyle = cva("font-bold", {
    variants: {
      difficulty: {
        [ELessonDifficulty.Easy]: "text-primary-300",
        [ELessonDifficulty.Medium]: "text-yellow-600",
        [ELessonDifficulty.Hard]: "text-red-900",
      },
    },
  });

  const buttonTitle =
    status === ELessonStatus.Completed ? "Completed"
    : status === ELessonStatus.InProgress ? "Start Learning"
    : "Locked";

  function handleOnPress() {
    if (status === ELessonStatus.Locked || status === ELessonStatus.Completed) return;
    selectionAsync();
    onPress();
  }

  return (
    <View style={[styles.px6]}>
      <View className={wrapperStyle({ status })} style={[styles.p4, { minHeight: normalize(200) }]}>
        <View>
          <TextContent className="font-bold text-white">{title}</TextContent>
          <TextContent numberOfLines={1} size="xs" className="italic text-white">
            {content}
          </TextContent>
        </View>
        <View className="flex-row items-center justify-between">
          <LessonDetail label="Difficulty">
            <TextContent size="xs" className={difficultyStyle({ difficulty })}>
              {difficulty}
            </TextContent>
          </LessonDetail>
          <LessonDetail label="Avg. Time">
            <TextContent size="xs" className="font-bold ">
              {avgTime} min
            </TextContent>
          </LessonDetail>
          <LessonDetail label="Experience">
            <TextContent size="2xs">⭐️ </TextContent>
            <TextContent size="xs" className="text-center font-bold">
              {xpValue}
            </TextContent>
          </LessonDetail>
        </View>
        <ActionButton title={buttonTitle} className={buttonStyle({ status })} onPress={handleOnPress} />
      </View>
    </View>
  );
};

export default LessonInfo;
