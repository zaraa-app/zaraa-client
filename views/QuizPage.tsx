import React from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

const QuizPage = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary-300">
      {/* Top Bar */}
      <View className="flex-row items-center justify-between px-4 pt-2">
        <TouchableOpacity className="rounded-full bg-white p-2">
          <FontAwesome6 name="arrow-left" size={16} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white">Question 1/5</Text>
        <View className="flex-row items-center gap-1">
          <FontAwesome6 name="heart" color="white" size={16} />
          <Text className="text-base font-semibold text-white">5</Text>
        </View>
      </View>

      {/* Main White Container */}
      <View className="mx-4 mt-6 flex-1 rounded-3xl bg-white p-4">{/* You can add question text, flashcards, etc here */}</View>
    </SafeAreaView>
  );
};

export default QuizPage;
