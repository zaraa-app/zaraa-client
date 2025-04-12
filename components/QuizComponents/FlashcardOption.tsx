import React, { useEffect } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate, Extrapolate } from "react-native-reanimated";

interface FlashcardOptionProps {
  id: string;
  letter: string;
  isSelected: boolean;
  isCorrect?: boolean;
  checked?: boolean;
  imageUrl?: string;
  onPress: () => void;
}

const FlashcardOption: React.FC<FlashcardOptionProps> = ({ letter, isSelected, isCorrect, checked = false, imageUrl, onPress }) => {
  const flip = useSharedValue(0); // 0 = front, 180 = back

  useEffect(() => {
    flip.value = withTiming(isSelected ? 180 : 0, { duration: 400 });
  }, [isSelected]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateY: `${interpolate(flip.value, [0, 180], [0, 180])}deg`,
        },
      ],
      backfaceVisibility: "hidden",
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateY: `${interpolate(flip.value, [0, 180], [180, 360])}deg`,
        },
      ],
      backfaceVisibility: "hidden",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
  });

  const borderColor =
    checked ?
      isCorrect ? "#4CAF50"
      : "#D5001B"
    : "transparent";

  return (
    <Pressable onPress={onPress} className="my-2 aspect-square w-[48%] overflow-hidden rounded-xl" style={{ borderWidth: 4, borderColor }}>
      <Animated.View className="items-center justify-center rounded-xl bg-white" style={[frontAnimatedStyle, { flex: 1 }]}>
        <Text className="text-4xl font-bold">{letter}</Text>
      </Animated.View>

      <Animated.View className="items-center justify-center rounded-xl bg-white" style={[backAnimatedStyle, { flex: 1 }]}>
        {imageUrl ?
          <Image source={{ uri: imageUrl }} className="h-full w-full rounded-xl" resizeMode="cover" />
        : <Text className="text-center">No Image</Text>}
      </Animated.View>

      {checked && isSelected && (
        <View className="absolute right-2.5 top-2.5 z-10 rounded-full bg-black/60 p-1.5">
          <FontAwesome6 name={isCorrect ? "check" : "xmark"} size={24} color="#fff" />
        </View>
      )}
    </Pressable>
  );
};

export default FlashcardOption;
