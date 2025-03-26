import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Modal } from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";
import ProfileEditView from "@/views/ProfileEditView";
import TextContent from "@/components/TextContent";
import { FontAwesome6 } from "@expo/vector-icons";
import AnswerOption from "@/components/QuizComponents/AnswerOption";

const xpLevels = [
  { minXP: 0, description: "Seedling 🌱 - Just getting started!" },
  { minXP: 100, description: "Sprout 🌿 - Learning the basics!" },
  { minXP: 300, description: "Budding Gardener 🌷 - Getting better!" },
  { minXP: 600, description: "Cactus Care Beginner 🌵 - Understanding resilience!" },
  { minXP: 1000, description: "Plant Whisperer 🍃 - Gaining deeper knowledge!" },
  { minXP: 1500, description: "Botanical Enthusiast 🌺 - Thriving in plant care!" },
  { minXP: 2200, description: "Garden Guardian 🌳 - Taking care of plants like a pro!" },
  { minXP: 3000, description: "Eco Warrior 🍀 - Spreading greenery everywhere!" },
  { minXP: 4000, description: "Master Grower 🌾 - Master of plant growth!" },
  { minXP: 5000, description: "Legendary Botanist 🌎 - A true plant expert!" },
];

// Function to get level description based on XP
const getLevelDescription = (xp: number) => {
  for (let i = xpLevels.length - 1; i >= 0; i--) {
    if (xp >= xpLevels[i].minXP) {
      return xpLevels[i].description;
    }
  }
  return "Seedling 🌱 - Just getting started!";
};

const ProfileScreen: React.FC = () => {
  const { user } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-6 items-center">
      {/* Profile Section */}
      <View className="w-full items-center">
        {/* Avatar */}
        <View className="h-24 w-24 rounded-full bg-white items-center justify-center">
          {user.avatar ? (
            <Image source={{ uri: user.avatar.toString() }} className="h-24 w-24 rounded-full" />
          ) : (
            <TextContent className="text-3xl font-bold text-white">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </TextContent>
          )}
        </View>

        {/* User Details */}
        <View className="mt-4 flex-row items-center gap-1">
          <Text className="text-2xl font-bold text-black">{user.name}</Text>
          {/* Edit Icon next to the name */}
          <TouchableOpacity onPress={() => setIsEditing(true)} className="h-6 w-6 items-center justify-center">
            <FontAwesome6 name="pen-to-square" size={12} />
          </TouchableOpacity>
        </View>

        {/* Dynamic Level Description based on XP */}
        <Text className="text-lg text-gray-500 italic">
          {getLevelDescription(user.xp)}
        </Text>

        {/* XP Section Styled Like Reference Image */}
        <View className="mt-6 w-full max-w-md items-center">
          {/* XP Label */}
          <View className="items-start justify-between w-full mb-2">
            <Text className="font-medium text-black">Current Score</Text>
          </View>
          <View className="w-full p-4 rounded-2xl bg-yellow-50 items-center">
            <Text className="text-xl font-bold text-yellow-800">⭐ {user.xp} XP</Text>
          </View>
        </View>
      </View>

          <Text>Testing for AnswerOption</Text>

          <AnswerOption letter="A" text="Moist and clay-like soil" isCorrect={true} />
          <AnswerOption letter="B" text="Dry and sandy soil" isCorrect={false} />

          

      {/* Profile Edit Modal */}
      <Modal visible={isEditing} animationType="slide">
        <ProfileEditView onClose={() => setIsEditing(false)} />
      </Modal>
    </View>
  );
};

export default ProfileScreen;
