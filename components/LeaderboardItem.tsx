import styles from "@/utils/styles";
import React from "react";
import { View, Text, Image } from "react-native";

export interface LeaderBoardItemProps {
  rank: number;
  name: string;
  xp: number;
  avatar: URL;
}

const LeaderboardItem = ({ rank, name, xp, avatar }: LeaderBoardItemProps) => {
  return (
    <View className="w-full flex-row items-center justify-between rounded-2xl bg-secondary-100 p-4">
      {/* Rank Number */}
      <Text className="w-10 text-lg font-bold text-neutral-900">{rank}th</Text>

      {/* Profile Section */}
      <View className="w-full flex-row items-center justify-start" style={[styles.gap2]}>
        <Image source={{ uri: avatar.toString() }} resizeMode="contain" className="h-8 w-8 rounded-full" />
        <Text className="text-lg font-bold text-neutral-1000">{name}</Text>
      </View>

      {/* xp */}
      <Text className="text-lg font-bold text-green-200">{xp}</Text>
    </View>
  );
};

export default LeaderboardItem;
