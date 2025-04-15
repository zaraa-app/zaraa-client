import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Modal } from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";
import ProfileEditView from "@/views/ProfileEditView";
import TextContent from "@/components/TextContent";
import { FontAwesome6 } from "@expo/vector-icons";
import QuizPage from "@/views/QuizPage";


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
    <QuizPage></QuizPage>
  );
};

export default ProfileScreen;
