import React from "react";
import { View, Text, Image } from "react-native";

const TopThreeLeaderboard = ({ topThree }) => {
  if (!topThree || topThree.length < 3) return null; // Ensure we have at least 3 users

  return (
    <View className="bg-primary-300 rounded-b-3xl py-12 px-5 items-center">
      {/* Leaderboard Title - Left-Aligned */}
      <Text className="text-white text-3xl font-bold self-start mb-14">Leaderboard</Text>

      {/* Top 3 Players */}
      <View className="flex-row items-end justify-center space-x-5">
        {/* 2nd Place */}
        <View className="items-center mb-2">
          <Text className="text-white text-xl font-bold mt-2">2nd</Text>
          <Image 
            style={{width: 150,height:50}}
            source={ require("@/assets/images/blackMan.png") } 
            className="w-24 h-24 rounded-full border-2 border-white" 
            resizeMode="contain"
            />
          <Text className="text-white text-2xl font-bold mt-1">{topThree[1].score}</Text>
          <Text className="text-white text-base">{topThree[1].name}</Text>
        </View>

        {/* 1st Place - Centered & Larger */}
        <View className="items-center relative mt-6">
          <Image source={{ uri: topThree[0].image }} className="w-28 h-28 rounded-full border-2 border-white" />
          {/* 🔹 FIXED Crown Image */}
          <Image 
            style={{width: 135,height:35}}
            source={require("@/assets/images/crown.png")} 
            className="absolute -top-10 w-12 h-12" 
            resizeMode="contain"
          />
          <Image 
            style={{width: 150,height:50}}
            source={ require("@/assets/images/blondeMan.png") } 
            className="w-24 h-24 rounded-full border-2 border-white" 
            resizeMode="contain"
            />
          <Text className="text-white text-2xl font-bold mt-2">{topThree[0].score}</Text>
          <Text className="text-white text-base">{topThree[0].name}</Text>
        </View>

        {/* 3rd Place */}
        <View className="items-center mb-2">
          <Text className="text-white text-xl font-bold mt-2">3rd</Text>
          <Image 
            style={{width: 150,height:50}}
            source={ require("@/assets/images/yellowMan.png") } 
            className="w-24 h-24 rounded-full border-2 border-white" 
            resizeMode="contain"
            />
          <Text className="text-white text-2xl font-bold mt-1">{topThree[2].score}</Text>
          <Text className="text-white text-base">{topThree[2].name}</Text>
        </View>
      </View>
    </View>
  );
};

export default TopThreeLeaderboard;
