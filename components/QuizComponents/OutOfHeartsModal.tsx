import React from "react";
import { View } from "react-native";
import ActionButton from "@/components/ActionButton";
import TextContent from "@/components/TextContent";
import { router } from "expo-router";

export default function OutOfHeartsModal() {
  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-black/50 px-8">
      <View className="w-full items-center rounded-2xl bg-white p-6 shadow-xl">
        <TextContent text="You're out of hearts 💔" size="lg" className="mb-2 text-center font-bold" />
        <TextContent
          text="You need more hearts to continue this lesson. Come back later or earn more to try again!"
          className="mb-4 text-center text-gray-600"
        />
        <ActionButton title="Go Back" onPress={() => router.back()} className="w-full" />
      </View>
    </View>
  );
}
