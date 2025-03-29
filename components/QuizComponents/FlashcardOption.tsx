import React, { useRef } from "react";
import { View, Text, Pressable, Image } from "react-native";
import CardFlip from "react-native-card-flip";
import { FontAwesome6 } from "@expo/vector-icons";

interface FlashcardOptionProps {
  id: string;
  letter: string;
  isSelected: boolean;
  isCorrect?: boolean;
  checked?: boolean;
  imageUrl?: string;
  onPress: () => void;
}

const FlashcardOption: React.FC<FlashcardOptionProps> = ({
  letter,
  isSelected,
  isCorrect,
  checked = false,
  imageUrl,
  onPress,
}) => {
  const cardRef = useRef<any>(null);

  React.useEffect(() => {
    if (cardRef.current) {
      isSelected ? cardRef.current.flip() : cardRef.current.flipBack();
    }
  }, [isSelected]);

  const borderColor = checked
    ? isCorrect
      ? "#4CAF50"
      : "#D5001B"
    : "transparent";

    const CardFlipAny = CardFlip as any;

  return (
    <Pressable
      onPress={onPress}
      className="w-[48%] aspect-square rounded-xl overflow-hidden my-2"
      style={{ borderWidth: 4, borderColor }}
    >
      <CardFlipAny ref={cardRef} style={{ flex: 1 }}>
        {/* Front (Letter side) */}
        <View className="flex-1 items-center justify-center rounded-xl bg-[#333]">
          <Text className="text-white text-xl font-bold">{letter}</Text>
        </View>

        {/* Back (Image side) */}
        <View className="flex-1 items-center justify-center rounded-xl bg-[#333] overflow-hidden">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-[#bbb] text-sm">Image</Text>
          )}
        </View>
      </CardFlipAny>

      {/* Icon Overlay */}
      {checked && isSelected && (
        <View className="absolute top-2.5 right-2.5 bg-black/60 p-1.5 rounded-full z-10">
          <FontAwesome6
            name={isCorrect ? "check" : "xmark"}
            size={24}
            color="#fff"
          />
        </View>
      )}
    </Pressable>
  );
};

export default FlashcardOption;
