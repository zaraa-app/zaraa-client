import { View, Text } from "react-native";
import React from "react";
import styles from "@/utils/styles";
import normalize from "@/utils/normalize";
import TextContent from "./TextContent";
import ActionButton from "./ActionButton";

const LessonInfo = () => {
  return (
    <View style={[styles.px6]}>
      <View className="justify-between rounded-3xl bg-primary-300" style={[styles.p4, { minHeight: normalize(186) }]}>
        <View>
          <TextContent className="font-bold text-white">💧 Lesson 1: Getting Started</TextContent>
          <TextContent size="2xs" className="italic text-white">
            Discover how to quench your catus's thirst without drowning it.
          </TextContent>
        </View>
        <View className="flex-row items-center justify-between">
          <TextContent size="2xs" className="font-bold text-white">
            10 minutes
          </TextContent>
        </View>
        <ActionButton title="Start Learning" className="bg-primary-500" onPress={() => {}} />
      </View>
    </View>
  );
};

export default LessonInfo;
