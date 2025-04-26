import React, { useEffect, useMemo, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ForumCommentsResponse, ForumPostResponse } from "@/api/types/forumPost.types";
import ForumOverview from "@/views/ForumOverview";
import { getForumPostById } from "@/api/services/forumPost.service";

export default function ForumDetail() {
  const { forumId } = useLocalSearchParams<{ forumId: string }>();
  const [post, setPost] = useState<ForumPostResponse | null>(null);
  const [loading, setLoading] = useState(true);

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

  const buildCommentTree = (comments: ForumCommentsResponse[]) => {
    const map = new Map();
    const roots: ForumCommentsResponse[] = [];

    comments.forEach((comment) => {
      map.set(comment.$id, { ...comment, replies: [] });
    });

    map.forEach((comment) => {
      if (comment.replyingTo) {
        const parent = map.get(comment.replyingTo);
        if (parent) {
          parent.replies.push(comment);
        } else {
          roots.push(comment);
        }
      } else {
        roots.push(comment);
      }
    });

    return roots;
  };

  const structuredComments = useMemo(() => (post?.comments ? buildCommentTree(post.comments) : []), [post?.comments]);

  useEffect(() => {
    if (forumId) fetchPost();
  }, [forumId]);

  if (loading || !post) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <ForumOverview post={post} comments={structuredComments} refetchPost={fetchPost} />;
}
