import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ForumPostResponse } from "@/api/types/forumPost.types";
import ForumOverview from "@/views/ForumOverview";
import { getForumPostById } from "@/api/services/forumPost.service";

export default function ForumDetail() {
  const { forumId } = useLocalSearchParams<{ forumId: string }>();
  const [post, setPost] = useState<ForumPostResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getForumPostById(forumId);
        setPost(data);
      } catch (err) {
        console.error("Error fetching forum post:", err);
      } finally {
        setLoading(false);
      }
    };

    if (forumId) fetchPost();
  }, [forumId]);

  if (loading || !post) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <ForumOverview post={post} />;
}
