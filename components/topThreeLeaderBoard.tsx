import React from "react";
import { View, Text, Image } from "react-native";

const TopThreeLeaderboard = ({ topThree }) => {
  if (!topThree || topThree.length < 3) return null; // Ensure at least 3 users exist

  return (
    <View className="items-center rounded-b-3xl bg-primary-300" style={{ paddingHorizontal: 20, paddingTop: 32, paddingBottom: 48, gap: 16 }} >
      {/* Leaderboard Title - Left-Aligned */}
      <Text className="mb-6 self-start text-3xl font-bold text-white">Leaderboard</Text>

      {/* Top 3 Players */}
      <View className="flex-row items-end justify-center gap-12">
        {/* 2nd Place */}
        <View className="mb-20 items-center">
          <Text className="mt-1 text-xl font-bold text-white">2nd</Text>
          <Image source={{ uri: topThree[1].avatar.toString() }} className="h-20 w-20 rounded-full border-2 border-white" />
          <Text className="text-3xl font-bold text-white">{topThree[1].xp}</Text>
          <Text className="text-base text-white">{topThree[1].name}</Text>
        </View>

        {/* 1st Place - Centered & Larger */}
        <View className="relative mt-20 items-center"> 
          <Image source={require("@/assets/images/crown6.png")} className="absolute -top-10 h-12 w-16" resizeMode="contain" />
          <Image source={{ uri: topThree[0].avatar.toString() }} className="h-24 w-24 rounded-full border-2 border-white" />
          <Text className="mt-1 text-3xl font-bold text-white">{topThree[0].xp}</Text>
          <Text className="text-base text-white">{topThree[0].name}</Text>
        </View>

        {/* 3rd Place */}
        <View className="mb-20 items-center">
          <Text className="mt-1 text-xl font-bold text-white">3rd</Text>
          <Image source={{ uri: topThree[2].avatar.toString() }} className="h-20 w-20 rounded-full border-2 border-white" />
          <Text className="text-3xl font-bold text-white">{topThree[2].xp}</Text>
          <Text className="text-base text-white">{topThree[2].name}</Text>
        </View>
      </View>
    </View>
  );
};

export default TopThreeLeaderboard;
