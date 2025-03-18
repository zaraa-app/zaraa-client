import { FlatList, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import ForumPost from "@/components/Forum/ForumPost";
import { ForumPostResponse } from "@/api/types/forumPost.types";
import styles from "@/utils/styles";
import normalize from "@/utils/normalize";
import HeadingContent from "@/components/HeadingContent";
import TextContent from "@/components/TextContent";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ForumSearch from "@/components/Forum/ForumSearch";
import TagLabel from "@/components/TagLabel";

const mockForum: ForumPostResponse = {
  title: "How often should I water my plant?",
  body: "I have a plant that needs water every 2-3 days. How often should I water it?",
  user: {
    $id: "1",
    name: "John Doe",
    image: "https://picsum.photos/536/354",
    avatar: new URL("https://picsum.photos/536/354"),
    email: "johndoe@example.com",
    xp: 100,
    hearts: 50,
    streak: 30,
    $collectionId: "users",
    $databaseId: "plants",
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: ["read", "write"],
  },
  $id: "1",
  $collectionId: "forums",
  $databaseId: "plants",
  $createdAt: new Date().toISOString(),
  $updatedAt: new Date().toISOString(),
  $permissions: ["read", "write"],
};

const Forums = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <View style={[styles.pt2]}>
      <View style={[styles.gap2, styles.mb4]}>
        <View className="flex-row items-center justify-between" style={[styles.px6]}>
          <HeadingContent className="flex-1 " size="h5" heading="Forums" />
          <TouchableOpacity
            className="flex-row items-center justify-center"
            style={[styles.gap1]}
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/forums/create")}
          >
            <Ionicons name="add" size={normalize(14)} />
            <TextContent text="Create Post" size="sm" />
          </TouchableOpacity>
        </View>
        <View style={[styles.px6]}>
          <ForumSearch value={searchQuery} onValueChange={setSearchQuery} />
        </View>

        <FlatList
          style={[styles.px6]}
          contentContainerStyle={[styles.gap1]}
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          renderItem={() => <TagLabel size="xs" color="secondary" label="Plant Care" />}
          showsHorizontalScrollIndicator={false}
          horizontal
        />
      </View>

      <FlatList
        style={[styles.px6]}
        contentContainerStyle={[styles.gap4]}
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        renderItem={() => <ForumPost forum={mockForum} />}
      />
    </View>
  );
};

export default Forums;
