import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { GestureDetector, GestureHandlerRootView, Gesture } from "react-native-gesture-handler";
import Animated, { useSharedValue, withSpring, useAnimatedStyle, runOnJS } from "react-native-reanimated";
import { useChapter } from "@/context/ChapterContext";
import styles from "@/utils/styles";
import TextContent from "./TextContent";
import { Ionicons } from "@expo/vector-icons";
import normalize from "@/utils/normalize";
import { selectionAsync } from "expo-haptics";
import { ChapterResponse } from "@/api/types/chapter.types";

const SWIPE_THRESHOLD = 25;

const chapterColors = [
  "rgba(109, 190, 69, 1)", // Primary green
  "rgba(87, 152, 55, 1)", // Dark Green
  "rgba(55, 102, 36, 1)", // Very Dark Green
  "rgba(50, 95, 29, 1)", // rest are darker shades of primary green
  "rgba(35, 70, 20, 1)",
  "rgba(25, 60, 15, 1)",
  "rgba(10, 30, 7, 1)",
];

interface ChapterSelectProps {
  onSelect?: (chapter: ChapterResponse) => void;
}

const ChapterSelect = ({ onSelect }: ChapterSelectProps) => {
  const { chapters, selectedChapter, setSelectedChapter } = useChapter();
  const translateX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (chapters.length > 0 && selectedChapter) {
      const newIndex = chapters.findIndex((chapter) => chapter.$id === selectedChapter.$id);
      if (newIndex !== -1) {
        setCurrentIndex(newIndex);
      }
    }
  }, [selectedChapter, chapters]);

  const currentColor = chapterColors[currentIndex % chapterColors.length];

  /**
   * Handles a swipe gesture by either incrementing or decrementing the current
   * index of the selected chapter, and then setting the selected chapter to the
   * chapter at the new index.
   * @param direction "left" or "right", indicating the direction of the swipe.
   */
  const handleSwipe = (direction: "left" | "right") => {
    let newIndex = currentIndex;

    if (direction === "left" && currentIndex < chapters.length - 1) {
      newIndex += 1;
    } else if (direction === "right" && currentIndex > 0) {
      newIndex -= 1;
    }

    selectionAsync();
    setSelectedChapter(chapters[newIndex]);
    if (onSelect) onSelect(chapters[newIndex]);
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

  /**
   * Navigates to the next chapter, if there is one.
   * Does nothing if we are already on the last chapter.
   */
  function nextChapter() {
    if (currentIndex < chapters.length - 1) {
      selectionAsync();
      setSelectedChapter(chapters[currentIndex + 1]);
      if (onSelect) onSelect(chapters[currentIndex + 1]);
      setCurrentIndex(currentIndex + 1);
    }
  }

  /**
   * Navigates to the previous chapter, if there is one.
   */
  function prevChapter() {
    if (currentIndex > 0) {
      selectionAsync();
      setSelectedChapter(chapters[currentIndex - 1]);
      if (onSelect) onSelect(chapters[currentIndex - 1]);
      setCurrentIndex(currentIndex - 1);
    }
  }

  /**
   * Takes a color string and an opacity number, and returns a new color string
   * with the given opacity. The color string is expected to be in the format
   * "rgba(r, g, b, a)", where 'a' is the opacity value. The function replaces the
   * opacity value with the given opacity number.
   * @param {string} color - The color string to modify.
   * @param {number} opacity - The opacity value to use.
   * @returns {string} A new color string with the given opacity.
   */
  const getFadedColor = (color: string, opacity: number) => {
    return color.replace("1)", `${opacity})`); // Adjusting opacity dynamically
  };

  const fadedColor = getFadedColor(currentColor, 0.4);

  return (
    <GestureHandlerRootView className="items-center" style={[styles.mt4, styles.px6]}>
      <View className="w-full flex-row items-center justify-between" style={[styles.gap2]}>
        <TouchableOpacity
          className={`aspect-square items-center justify-center rounded-full ${currentIndex === 0 ? "bg-primary-100" : "bg-primary-300"}`}
          style={{ height: normalize(32), backgroundColor: currentIndex === 0 ? fadedColor : currentColor }}
          onPress={prevChapter}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back-outline" size={16} color="white" />
        </TouchableOpacity>
        <View
          className="w-full flex-1 justify-center overflow-hidden rounded-full bg-primary-300"
          style={[styles.p2, { minHeight: normalize(64), backgroundColor: currentColor }]}
        >
          <GestureDetector gesture={swipeGesture}>
            <Animated.View className="items-center justify-center" style={[animatedStyle, styles.gap1]}>
              <TextContent className="font-bold text-white">{`Chapter ${selectedChapter?.index}`}</TextContent>
              <TextContent className="text-white">{selectedChapter ? selectedChapter.title : "Select Chapter"}</TextContent>
            </Animated.View>
          </GestureDetector>
        </View>
        <TouchableOpacity
          className={`aspect-square items-center justify-center rounded-full`}
          style={{ height: normalize(32), backgroundColor: currentIndex === chapters.length - 1 ? fadedColor : currentColor }}
          onPress={nextChapter}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-forward-outline" size={12} color="white" />
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

export default ChapterSelect;
