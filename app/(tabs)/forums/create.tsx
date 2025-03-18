// app/(tabs)/forums/create.tsx
import React from "react";
import { View, Text, Button, TextInput } from "react-native";
import { useRouter } from "expo-router";

export default function CreateForum() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Button title="Close" onPress={() => router.back()} />

      <Text style={{ fontSize: 20, marginTop: 10 }}>Create a Forum</Text>

      <TextInput placeholder="Title" style={{ borderWidth: 1, marginVertical: 10 }} />
      <TextInput placeholder="Body text" style={{ borderWidth: 1, height: 100, marginBottom: 10 }} multiline />
      
      <Button
        title="Post"
        onPress={() => {
          router.back();
        }}
      />
    </View>
  );
}
