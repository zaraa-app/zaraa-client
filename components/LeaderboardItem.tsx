import styles from "@/utils/styles";
import React from "react";
import { View, Text, Image } from "react-native";
import TextContent from "./TextContent";
import normalize from "@/utils/normalize";

export interface LeaderBoardItemProps {
  rank: number;
  name: string;
  xp: number;
  avatar: URL;
}

const LeaderboardItem = ({ rank, name, xp, avatar }: LeaderBoardItemProps) => {
  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-secondary-100" style={[styles.p3]}>
      <View className="flex-row items-center" style={[styles.gap2]}>
        <TextContent className="w-10 text-center text-lg text-neutral-1000">{rank}th</TextContent>
        <View className="flex-row items-center justify-start" style={[styles.gap2]}>
          <Image
            source={{ uri: avatar.toString().replace("/preview", "/view") }}
            resizeMode="contain"
            className="rounded-full"
            style={{ height: normalize(32), width: normalize(32) }}
          />
          <TextContent className="items-center justify-center text-center text-lg font-semibold text-neutral-1000">{name}</TextContent>
        </View>
      </View>
      <TextContent className="text-lg font-bold text-primary-300">{xp == 0 ? "0" : xp}</TextContent>
    </View>
  );
};

export default LeaderboardItem;
