import React, { useEffect, useState } from "react";
import { View, Alert, ActivityIndicator, ScrollView, TouchableOpacity, Text, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import FormField from "@/components/FormField";
import ActionButton from "@/components/ActionButton";
import TextContent from "@/components/TextContent";
import { useGlobalContext } from "@/context/GlobalProvider";
import { UserResponse } from "@/api/types/user.types";
import { uploadImage } from "@/api/services/storage.service";
import { updateUser } from "@/api/services/user.service";

const ProfileScreen: React.FC = () => {
  const { user, setUser } = useGlobalContext();

  const [updatedUser, setUpdatedUser] = useState<UserResponse>({} as UserResponse);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;

    setUpdatedUser({ ...user });
  }, [user]);

  const handleInputChange = (field: keyof UserResponse, value: any) => {
    setUpdatedUser((prevUser) => {
      if (!prevUser) {
        return { [field]: value } as UserResponse;
      }
      return { ...prevUser, [field]: value };
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const updatedProfile = await updateUser(updatedUser);

      if (!updatedProfile) throw new Error("Failed to update profile");

      setUser(updatedProfile);

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Could not update profile.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles Image Selection from Library or Camera
   */
  const pickImage = async (fromCamera: boolean = false) => {
    try {
      let result: ImagePicker.ImagePickerResult = await (fromCamera
        ? ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ FIXED
            allowsEditing: true,
            quality: 1,
          })
        : ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ FIXED
            allowsEditing: true,
            quality: 1,
          }));

      if (!result.canceled && result.assets.length > 0) {
        setUploading(true);
        const image = result.assets[0];

        // ✅ Define FileRequest Type
        type FileRequest = {
          name: string;
          type: string;
          size: number;
          uri: string;
        };

        const fileRequest: FileRequest = {
          name: image.fileName ?? `${Date.now()}.jpg`,
          type: image.mimeType ?? "image/jpeg",
          size: image.fileSize ?? 0,
          uri: image.uri ?? "",
        };

        // Upload to Appwrite
        const response = await uploadImage(fileRequest);

        if (!response) {
          console.error("Error uploading image to Appwrite");
          return;
        }

        setUpdatedUser({ ...updatedUser, avatar: response });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Could not select image.");
    } finally {
      setUploading(false);
    }
  };

  if (loading || Object.keys(updatedUser).length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6ABF4B" />
      </View>
    );
  }

  return (
    <ScrollView className="h-full w-full bg-white">
      <View className="flex items-center p-6">
        {/* Editable Profile Picture */}
        <TouchableOpacity onPress={() => pickImage(false)} className="relative mb-6">
          <View className="h-32 w-32 items-center justify-center rounded-full bg-primary-alpha-10">
            {updatedUser.avatar ? (
              <Image source={{ uri: updatedUser.avatar.toString() }} className="h-32 w-32 rounded-full" />
            ) : (
              <TextContent className="text-4xl font-bold text-primary-500">
                {updatedUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </TextContent>
            )}
          </View>
          {/* Overlay Camera Icon */}
          <View className="absolute bottom-0 right-0 h-10 w-10 items-center justify-center rounded-full bg-gray-300">
            <Text className="text-lg text-gray-700">📷</Text>
          </View>
        </TouchableOpacity>

        {/* Form Fields */}
        <View className="w-full max-w-lg" style={{ gap: 8 }}>
          <FormField label="Name" value={updatedUser.name} onValueChange={(value) => handleInputChange("name", value)} />
          <FormField
            label="Phone number"
            value={updatedUser.phoneNumber || ""}
            onValueChange={(value) => handleInputChange("phoneNumber", value)}
            keyboardType="phone-pad"
          />
          <FormField
            label="Email"
            value={updatedUser.email}
            onValueChange={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
          />
          <FormField label="Country" value={updatedUser.country || ""} onValueChange={(value) => handleInputChange("country", value)} />
          <FormField
            label="Date of Birth"
            value={updatedUser.dateOfBirth || ""}
            onValueChange={(value) => handleInputChange("dateOfBirth", value)}
          />
        </View>

        {/* Save Button */}
        <ActionButton
          title={uploading ? "Uploading..." : "Save Changes"}
          onPress={handleSave}
          className="mb-12 mt-10 w-full max-w-lg p-5"
          disabled={uploading}
        />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
