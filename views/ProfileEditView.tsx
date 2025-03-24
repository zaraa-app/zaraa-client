import React, { useEffect, useState } from "react";
import { View, Alert, ActivityIndicator, ScrollView, TouchableOpacity, Text, Image, SafeAreaView } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Importing Picker
import * as ImagePicker from "expo-image-picker";
import FormField from "@/components/FormField";
import ActionButton from "@/components/ActionButton";
import TextContent from "@/components/TextContent";
import { useGlobalContext } from "@/context/GlobalProvider";
import { UserResponse } from "@/api/types/user.types";
import { uploadImage } from "@/api/services/storage.service";
import { updateUser } from "@/api/services/user.service";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import styles from "@/utils/styles";
import { Language } from "@/api/enums/ELanguage.enum";

interface ProfileEditViewProps {
  onClose: () => void;
}

const ProfileEditView: React.FC<ProfileEditViewProps> = ({ onClose }) => {
  const { user, setUser } = useGlobalContext();
  const [updatedUser, setUpdatedUser] = useState<UserResponse>({} as UserResponse);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);

  const countries = {
    US: "United States",
    AT: "Austria",
    DE: "Germany",
    FR: "France",
    ES: "Spain",
    IT: "Italy",
    UK: "United Kingdom",
    CA: "Canada",
    JO: "Jordan",
  };

  const [selectedCountry, setSelectedCountry] = useState(user?.country || "United States");
  console.log("Test");
  
  console.log(user?.country);

  console.log(user?.name);

  useEffect(() => {
    if (!user) return;
    setUpdatedUser({ ...user });
  }, [user]);

  const handleInputChange = (field: keyof UserResponse, value: any) => {
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!user) throw new Error("User not found");

      const updatedProfile = await updateUser(user, updatedUser);
      if (!updatedProfile) throw new Error("Failed to update profile");

      setUser(updatedProfile);
      Alert.alert("Success", "Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Could not update profile.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (fromCamera: boolean = false) => {
    try {
      let result: ImagePicker.ImagePickerResult = await (fromCamera
        ? ImagePicker.launchCameraAsync({
            mediaTypes: "images",
            allowsEditing: true,
            quality: 1,
          })
        : ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            quality: 1,
          }));

      if (!result.canceled && result.assets.length > 0) {
        setUploading(true);
        const image = result.assets[0];

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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="h-full w-full bg-white">
        <View className="flex items-center p-6">
          {/* Editable Profile Picture */}
          <TouchableOpacity onPress={() => pickImage(false)} className="relative mb-6">
            <View className="h-32 w-32 items-center justify-center rounded-full bg-primary-alpha-10">
              {updatedUser.avatar ? (
                <Image source={{ uri: updatedUser.avatar.toString() }} className="h-32 w-32 rounded-full" />
              ) : (
                <TextContent className="text-4xl font-bold text-white">
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
          <View className="w-full max-w-lg" style={[styles.gap4]}>
            <FormField label="Name" value={updatedUser.name} onValueChange={(value) => handleInputChange("name", value)} />
            <FormField
              label="Phone number"
              value={updatedUser.phoneNumber ? updatedUser.phoneNumber.toString() : ""}
              onValueChange={(value) => handleInputChange("phoneNumber", parseInt(value || "0"))}
              keyboardType="phone-pad"
            />
            <FormField label="Email" value={updatedUser.email} onValueChange={(value) => handleInputChange("email", value)} keyboardType="email-address" />

            {/* Country Picker */}
            <TouchableOpacity onPress={() => setIsCountryModalVisible(true)} activeOpacity={0.7}>
              <View pointerEvents="none">
                <FormField label="Country" value={updatedUser.country || "Select a country..."} onValueChange={() => {}} />
              </View>
            </TouchableOpacity>

            {/* Language Picker */}
            <TouchableOpacity onPress={() => setLanguageModalVisible(true)} activeOpacity={0.7}>
              <View pointerEvents="none">
                <FormField label="Language" value={updatedUser.language || "Select a language..."} onValueChange={() => {}} />
              </View>
            </TouchableOpacity>
          </View>

            {/* Country Picker Modal */}
            <Modal isVisible={isCountryModalVisible} onBackdropPress={() => setIsCountryModalVisible(false)}>
            <View className="bg-white p-6 rounded-lg">
                {/* Country Picker */}
                <Picker
                selectedValue={updatedUser.country} onValueChange={(itemValue) => handleInputChange("country", itemValue)} 
                >
                <Picker.Item label="United States" value={countries.US} />
                <Picker.Item label="Germany" value={countries.DE} />
                <Picker.Item label="France" value={countries.FR} />
                <Picker.Item label="Italy" value={countries.IT} />
                <Picker.Item label="Spain" value={countries.ES} />
                <Picker.Item label="Jordan" value={countries.JO} />
                <Picker.Item label="Austria" value={countries.AT} />
                </Picker>

                {/* Select Button */}
                <TouchableOpacity
                onPress={() => {
                    handleInputChange("country", updatedUser.country); 
                    setIsCountryModalVisible(false); // Close modal
                }}
                className="mt-4 p-3 bg-blue-500 rounded-lg items-center"
                >
                <Text className="text-white font-bold">Select</Text>
                </TouchableOpacity>
            </View>
            </Modal>

            {/* Language Modal */}
            <Modal isVisible={isLanguageModalVisible} onBackdropPress={() => setLanguageModalVisible(false)}>
            <View className="bg-white p-6 rounded-lg">
                {/* Language Picker */}
                <Picker
                selectedValue={updatedUser.language} onValueChange={(itemValue) => handleInputChange("language", itemValue)} // Temporarily store selection
                >
                <Picker.Item label="English" value={Language.English} />
                <Picker.Item label="Arabic" value={Language.Arabic} />
                </Picker>

                {/* Select Button */}
                <TouchableOpacity
                onPress={() => {
                    handleInputChange("language", updatedUser.language); 
                    setLanguageModalVisible(false); // Close modal
                }}
                className="mt-4 p-3 bg-blue-500 rounded-lg items-center"
                >
                <Text className="text-white font-bold">Select</Text>
                </TouchableOpacity>
            </View>
            </Modal>

          {/* Save Button */}
          <ActionButton title={uploading ? "Uploading..." : "Save Changes"} onPress={handleSave} className="mb-4 mt-10 w-full max-w-lg p-5" disabled={uploading} />
          <ActionButton title="Back" onPress={onClose} intent="tertiary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileEditView;
