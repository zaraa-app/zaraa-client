import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { GestureDetector, GestureHandlerRootView, Gesture } from "react-native-gesture-handler";
import Animated, { useSharedValue, withSpring, useAnimatedStyle, runOnJS } from "react-native-reanimated";
import { useChapter } from "@/context/ChapterContext";
import styles from "@/utils/styles";
import TextContent from "./TextContent";
import { Ionicons } from "@expo/vector-icons";
import normalize from "@/utils/normalize";

const SWIPE_THRESHOLD = 25;

const ChapterSelect = () => {
  const { chapters, selectedChapter, setSelectedChapter } = useChapter();
  const chapterIndex = chapters.findIndex((c) => c.$id === selectedChapter?.$id) || 0;
  const translateX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(chapterIndex);

  const handleSwipe = (direction: "left" | "right") => {
    let newIndex = currentIndex;

    if (direction === "left" && currentIndex < chapters.length - 1) {
      newIndex += 1;
    } else if (direction === "right" && currentIndex > 0) {
      newIndex -= 1;
    }

    setSelectedChapter(chapters[newIndex]);
    setCurrentIndex(newIndex);
    translateX.value = withSpring(0);
  };

  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD) {
        runOnJS(handleSwipe)("left");
      } else if (event.translationX > SWIPE_THRESHOLD) {
        runOnJS(handleSwipe)("right");
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  function nextChapter() {
    if (currentIndex < chapters.length - 1) {
      setSelectedChapter(chapters[currentIndex + 1]);
      setCurrentIndex(currentIndex + 1);
    }
  }

  function prevChapter() {
    if (currentIndex > 0) {
      setSelectedChapter(chapters[currentIndex - 1]);
      setCurrentIndex(currentIndex - 1);
    }
  }

  return (
    <GestureHandlerRootView className="items-center" style={[styles.mt4, styles.px6]}>
      <View className="w-full flex-row items-center justify-between" style={[styles.gap2]}>
        <View
          className={`aspect-square items-center justify-center rounded-full ${currentIndex === 0 ? "bg-primary-100" : "bg-primary-300"}`}
          style={{ height: normalize(32) }}
        >
          {currentIndex > 0 && <Ionicons name="chevron-back-outline" size={16} color="white" suppressHighlighting onPress={prevChapter} />}
        </View>
        <View
          className="w-full flex-1 justify-center overflow-hidden rounded-full bg-primary-300"
          style={[styles.p2, { minHeight: normalize(64) }]}
        >
          <GestureDetector gesture={swipeGesture}>
            <Animated.View className="items-center justify-center" style={[animatedStyle, styles.gap1]}>
              <TextContent className="font-bold text-white">{`Chapter ${currentIndex + 1}`}</TextContent>
              <TextContent className="text-white">{selectedChapter ? selectedChapter.title : "Select Chapter"}</TextContent>
            </Animated.View>
          </GestureDetector>
        </View>
        <View
          className={`aspect-square items-center justify-center rounded-full ${currentIndex === chapters.length - 1 ? "bg-primary-100" : "bg-primary-300"}`}
          style={{ height: normalize(32) }}
        >
          {currentIndex < chapters.length - 1 && (
            <Ionicons name="chevron-forward-outline" size={12} color="white" suppressHighlighting onPress={nextChapter} />
          )}
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const stylesNo = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  chapterBox: {
    width: "100%",
    minHeight: 48,
    backgroundColor: "#4CAF50",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  chapterText: {
    fontSize: 18,
    fontWeight: "400",
    color: "white",
    textAlign: "center",
  },
});

export default ChapterSelect;
