import { FlatList, View } from "react-native";
import React from "react";
import ForumPost from "@/components/ForumPost";
import { ForumPostResponse } from "@/api/types/forumPost.types";
import styles from "@/utils/styles";
import normalize from "@/utils/normalize";

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
  return (
    <FlatList
      className="p-6"
      style={[styles.gap2]}
      ItemSeparatorComponent={() => <View style={[{ height: normalize(16) }]} />}
      data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      renderItem={() => <ForumPost forum={mockForum} />}
    />
  );
};

export default Forums;
