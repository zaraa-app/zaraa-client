import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Heart from "@/assets/icons/heart.svg";
import TextContent from "@/components/TextContent";
import ProgressBar from "@/components/ProgressBar";

export default function QuizHeader({ progress, hearts, onExitConfirm }: { progress: number; hearts: number; onExitConfirm: () => void }) {
  return (
    <View className="flex-row items-center justify-between gap-2">
      <Ionicons name="close" size={24} color="#374151" onPress={onExitConfirm} />
      <ProgressBar progress={progress} />
      <View className="flex-row items-center gap-1">
        <Heart width={24} height={24} />
        <TextContent text={hearts.toString()} className="text-center font-bold" />
      </View>
    </View>
  );
}
