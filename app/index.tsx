import React from "react";
import { Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Images from "@/constants/Images";
import TextContent from "@/components/TextContent";
import HeadingContent from "@/components/HeadingContent";

export default function Index() {
  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="flex h-full items-center justify-center px-8">
          <Image source={Images.mascot} />
          <HeadingContent size="h5">Let's Get Growing! 🌱</HeadingContent>
          <TextContent className="text-lg">Discover the joy of nurturing plants, one leaf at a time!</TextContent>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
