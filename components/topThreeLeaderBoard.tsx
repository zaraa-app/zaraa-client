import React from "react";
import { View, Text, Image } from "react-native";

const TopThreeLeaderboard = ({ topThree }) => {
  if (!topThree || topThree.length < 3) return null; // Ensure at least 3 users exist

  return (
    <View className="items-center rounded-b-3xl bg-primary-300 px-5 py-12">
      {/* Leaderboard Title - Left-Aligned */}
      <Text className="mb-14 self-start text-3xl font-bold text-white">Leaderboard</Text>

      {/* Top 3 Players */}
      <View className="flex-row items-end justify-center space-x-10">
        {/* 2nd Place */}
        <View className="mb-2 items-center">
          <Text className="mt-2 text-xl font-bold text-white">2nd</Text>
          <Image source={{ uri: topThree[1].avatar }} className="h-24 w-24 rounded-full border-2 border-white" />
          <Text className="mt-1 text-2xl font-bold text-white">{topThree[1].xp}</Text>
          <Text className="text-base text-white">{topThree[1].name}</Text>
        </View>

        {/* 1st Place - Centered & Larger */}
        <View className="relative mt-6 items-center">
          <Image source={{ uri: topThree[0].avatar }} className="h-28 w-28 rounded-full border-2 border-white" />
          <Image source={require("@/assets/images/crown.png")} className="absolute -top-10 h-12 w-12" resizeMode="contain" />
          <Text className="mt-2 text-2xl font-bold text-white">{topThree[0].xp}</Text>
          <Text className="text-base text-white">{topThree[0].name}</Text>
        </View>

        {/* 3rd Place */}
        <View className="mb-2 items-center">
          <Text className="mt-2 text-xl font-bold text-white">3rd</Text>
          <Image source={{ uri: topThree[2].avatar }} className="h-24 w-24 rounded-full border-2 border-white" />
          <Text className="mt-1 text-2xl font-bold text-white">{topThree[2].xp}</Text>
          <Text className="text-base text-white">{topThree[2].name}</Text>
        </View>
      </View>
    </View>
  );
};

export default TopThreeLeaderboard;
