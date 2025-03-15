import React, { useEffect, useState } from "react";
import { View, Alert, ActivityIndicator, ScrollView, TouchableOpacity, Text } from "react-native";
import { Client, Account, Models } from "appwrite";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "@env";
import FormField from "@/components/FormField";
import ActionButton from "@/components/ActionButton";
import TextContent from "@/components/TextContent";
import Modal from "react-native-modal";

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  country?: string;
  birthdate?: string;
  language: string;
}

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<UserProfile>({
    name: "",
    phone: "",
    email: "",
    country: "",
    birthdate: "",
    language: "English",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);

  const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
  const account = new Account(client);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response: Models.User<Models.Preferences> = await account.get();
        setUser({
          name: response.name || "",
          phone: response.phone || "",
          email: response.email || "",
          country: response.prefs?.country || "",
          birthdate: response.prefs?.birthdate || "",
          language: response.prefs?.language || "English",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setUser((prevUser) => ({ ...prevUser, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await account.update({
        name: user.name,
        phone: user.phone,
        email: user.email,
      });

      await account.updatePrefs({
        country: user.country,
        birthdate: user.birthdate,
        language: user.language,
      });

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Could not update profile.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6ABF4B" />
      </View>
    );
  }

  return (
    <ScrollView className="h-full w-full bg-white">
      <View className="flex items-center p-6">
        {/* User Avatar */}
        <View className="h-32 w-32 rounded-full bg-primary-alpha-10 items-center justify-center mb-10">
          <TextContent className="text-4xl font-bold text-primary-500">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </TextContent>
        </View>

        {/* Form Fields */}
        <View className="w-full max-w-lg" style={{ gap: 8 }}>
          <FormField label="Name" value={user.name} onValueChange={(value) => handleInputChange("name", value)} />
          <FormField label="Phone number" value={user.phone} onValueChange={(value) => handleInputChange("phone", value)} keyboardType="phone-pad" />
          <FormField label="Email" value={user.email} onValueChange={(value) => handleInputChange("email", value)} keyboardType="email-address" />
          <FormField label="Country" value={user.country || ""} onValueChange={(value) => handleInputChange("country", value)} />
          <FormField label="Date of Birth" value={user.birthdate || ""} onValueChange={(value) => handleInputChange("birthdate", value)} />

          {/* Language Dropdown Button */}
          <TouchableOpacity
            onPress={() => setLanguageModalVisible(true)}
            className="w-full rounded-lg border border-neutral-300 p-4"
          >
            <Text className="text-lg text-neutral-900">{user.language}</Text>
          </TouchableOpacity>

          {/* Language Selection Modal */}
          <Modal
            isVisible={isLanguageModalVisible}
            onBackdropPress={() => setLanguageModalVisible(false)}
            className="flex items-center justify-center"
          >
            <View className="w-full max-w-lg rounded-lg bg-white p-6">
              <Text className="mb-4 text-center text-lg font-bold text-neutral-900">Select Language</Text>

              {/* Language Options */}
              <TouchableOpacity
                onPress={() => {
                  handleInputChange("language", "English");
                  setLanguageModalVisible(false);
                }}
                className="w-full items-center rounded-lg p-4 text-lg text-neutral-900 hover:bg-gray-200"
              >
                <Text>English</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleInputChange("language", "Arabic");
                  setLanguageModalVisible(false);
                }}
                className="mt-2 w-full items-center rounded-lg p-4 text-lg text-neutral-900 hover:bg-gray-200"
              >
                <Text>Arabic</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>

        {/* Save Button */}
        <ActionButton title="Save Changes" onPress={handleSave} className="mt-6 w-full max-w-lg p-5 mb-12" />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;