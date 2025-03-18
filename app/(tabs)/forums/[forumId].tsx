// app/(tabs)/forums/[forumId].tsx
import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ForumDetail() {
  const { forumId } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18 }}>Forum ID: {forumId}</Text>
      {/* Show forum details, comments, etc. */}
    </View>
  );
}
