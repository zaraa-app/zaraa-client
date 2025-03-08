import { View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import HeadingContent from "@/components/HeadingContent";
import styles from "@/utils/styles";
import TextContent from "@/components/TextContent";
import ActionButton from "@/components/ActionButton";
import { router } from "expo-router";
import Animated, { Easing, FadeIn, FadeOut } from "react-native-reanimated";

const AllSet = () => {
  return (
    <Animated.View
      className="h-full items-center justify-center bg-primary-300"
      entering={FadeIn.duration(200).easing(Easing.linear)}
      exiting={FadeOut.duration(200)}
    >
      <View className="w-full" style={[styles.px8, styles.gap8]}>
        <View>
          <HeadingContent size="h5" heading="You're All Set! 🎉" className="text-center text-white" />
          <TextContent text="Your personalized plant journey starts now." className="text-white" />
        </View>
        <ActionButton title="Explore Zaraa" intent="tertiary" onPress={() => router.replace("/dashboard")} />
      </View>

      <StatusBar animated hidden />
    </Animated.View>
  );
};

export default AllSet;
