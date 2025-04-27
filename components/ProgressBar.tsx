import React from "react";
import { View } from "react-native";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <View className="flex-1 overflow-hidden rounded-full bg-secondary-200">
      <View className="flex-1 rounded-full bg-primary-300" style={{ width: `${progress * 100}%` }} />
    </View>
  );
}
