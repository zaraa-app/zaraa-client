import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Modal } from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";
import ProfileEditView from "@/views/ProfileEditView";
import TextContent from "@/components/TextContent";

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
        <View className="h-24 w-24 rounded-full bg-pink-500 items-center justify-center">
          {user.avatar ? (
            <Image source={{ uri: user.avatar.toString() }} className="h-24 w-24 rounded-full" />
          ) : (
            <TextContent className="text-3xl font-bold text-white"> {/* Ensured initials are white */}
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </TextContent>
          )}
        </View>

        {/* User Details */}
        <View className="mt-4 flex-row items-center space-x-2">
          <Text className="text-2xl font-bold text-black">{user.name}</Text>
          {/* Edit Icon next to the name */}
          <TouchableOpacity onPress={() => setIsEditing(true)} className="h-6 w-6 items-center justify-center">
            <Text className="text-lg">✏️</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-lg text-gray-500 italic">
          Level: {user.level ?? "Beginner"} 🌵
        </Text>

        {/* XP Section - Centered */}
        <View className="mt-4 w-full max-w-md p-4 rounded-lg bg-yellow-100 flex-row items-center justify-center">
          <Text className="text-lg font-bold text-yellow-700">⭐ {user.xp} XP</Text>
        </View>
      </View>

      {/* Profile Edit Modal */}
      <Modal visible={isEditing} animationType="slide">
        <ProfileEditView onClose={() => setIsEditing(false)} />
      </Modal>
    </View>
  );
};

export default ProfileScreen;
