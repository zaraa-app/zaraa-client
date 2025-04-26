import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Modal, ScrollView } from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";
import ProfileEditView from "@/views/ProfileEditView";
import TextContent from "@/components/TextContent";
import { FontAwesome6 } from "@expo/vector-icons";

import UserActivityCalendar from "@/components/Profile/UserActivityCalendar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
    <>
      <View className="flex-1 items-center bg-white p-6">
        <View className="w-full items-center">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-white">
            {user.avatar ?
              <Image source={{ uri: user.avatar.toString() }} className="h-24 w-24 rounded-full" />
            : <TextContent className="text-3xl font-bold text-white">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </TextContent>
            }
          </View>

          <View className="mt-4 flex-row items-center gap-1">
            <Text className="text-2xl font-bold text-black">{user.name}</Text>
            <TouchableOpacity onPress={() => setIsEditing(true)} className="h-6 w-6 items-center justify-center">
              <FontAwesome6 name="pen-to-square" size={12} />
            </TouchableOpacity>
          </View>

          <Text className="text-lg italic text-gray-500">{getLevelDescription(user.xp)}</Text>
        </View>
        <ScrollView className="mt-6 w-full" showsVerticalScrollIndicator={false}>
          <View className="mt-6 w-full max-w-md items-center">
            <View className="mb-2 w-full items-start justify-between">
              <Text className="font-medium text-black">Current Score</Text>
            </View>
            <View className="w-full items-center rounded-2xl bg-yellow-50 p-4">
              <Text className="text-xl font-bold text-yellow-800">⭐ {user.xp} XP</Text>
            </View>
          </View>

          <GestureHandlerRootView style={{ flex: 1 }}>
            <UserActivityCalendar />
          </GestureHandlerRootView>
        </ScrollView>
      </View>

      <Modal visible={isEditing} animationType="slide">
        <ProfileEditView onClose={() => setIsEditing(false)} />
      </Modal>
    </>
  );
};

export default ProfileScreen;
