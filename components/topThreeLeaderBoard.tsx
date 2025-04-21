import { UserResponse } from "@/api/types/user.types";
import styles from "@/utils/styles";
import React from "react";
import { View, Text, Image } from "react-native";

const TopThreeLeaderboard = ({ topThree }: { topThree: UserResponse[] }) => {
  if (!topThree || topThree.length < 3) return null; // Ensure at least 3 users exist

  return (
    <View className="items-center rounded-b-[56px] bg-primary-300" style={[styles.px6, styles.py4]}>
      {/* Leaderboard Title - Left-Aligned */}
      <Text className="mb-6 self-start text-3xl font-bold text-white">Leaderboard</Text>

      {/* Top 3 Players */}
      <View className="w-full flex-row items-center justify-between" style={[styles.px2]}>
        {/* 2nd Place */}
        <View className="mb-20 items-center" style={[styles.gap1]}>
          <Text className="mt-1 text-xl font-bold text-white">2nd</Text>
          <Image source={{ uri: topThree[1].avatar.toString().replace("/preview", "/view") }} className="h-20 w-20 rounded-full bg-white" />
          <Text className="text-2xl font-bold text-white">{topThree[1].xp}</Text>
          <Text className="text-base text-white">{topThree[1].name}</Text>
        </View>

        {/* 1st Place - Centered & Larger */}
        <View className="relative mt-20 items-center">
          <Image source={require("@/assets/images/crown6.png")} className="absolute -top-12 h-12 w-16" resizeMode="contain" />
          <Image source={{ uri: topThree[0].avatar.toString().replace("/preview", "/view") }} className="h-24 w-24 rounded-full bg-white" />
          <Text className="mt-1 text-2xl font-bold text-white">{topThree[0].xp}</Text>
          <Text className="text-base text-white">{topThree[0].name}</Text>
        </View>

        {/* 3rd Place */}
        <View className="mb-20 items-center" style={[styles.gap1]}>
          <Text className="mt-1 text-xl font-bold text-white">3rd</Text>
          <Image source={{ uri: topThree[2].avatar.toString().replace("/preview", "/view") }} className="h-20 w-20 rounded-full bg-white" />
          <Text className="text-2xl font-bold text-white">{topThree[2].xp}</Text>
          <Text className="text-base text-white">{topThree[2].name}</Text>
        </View>
      </View>
    </View>
  );
};

export default TopThreeLeaderboard;
