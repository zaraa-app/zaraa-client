import React from "react";
import { View, Text, Image } from "react-native";

const LeaderboardItem = ({ rank, name, initials, score, image }) => {
  return (
    <View className="flex-row items-center justify-between bg-secondary-100 p-4 rounded-2xl my-1 w-11/12 self-center">
      {/* Rank Number */}
      <Text className="text-lg font-bold text-neutral-900 w-10">{rank}th</Text>

      {/* Profile Section */}
      <View className="flex-row items-center space-x-2">
        {/* Circle Avatar with Fallback */}
        {image ? (
          <Image source={image} className="w-8 h-8 rounded-full" />
        ) : (
          <View className="w-8 h-8 rounded-full bg-green-alpha-10 flex items-center justify-center">
            <Text className="text-sm font-bold text-green-200">{initials}</Text>
          </View>
        )}
        <Text className="text-lg font-bold text-neutral-1000">{name}</Text>
      </View>

      {/* Score */}
      <Text className="text-lg font-bold text-green-200">{score}</Text>
    </View>
  );
};

export default LeaderboardItem;
