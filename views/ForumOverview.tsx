import React, { useState, useMemo } from "react";
import { View, Text, Image, FlatList, Pressable, ScrollView, Dimensions } from "react-native";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogBox } from "react-native";

import ImageViewing from "react-native-image-viewing";
import RenderHTML from "react-native-render-html";

import { ForumCommentsResponse, ForumPostResponse } from "@/api/types/forumPost.types";
import { relativeDate } from "@/components/Forum/ForumPost";
import { useGlobalContext } from "@/context/GlobalProvider";
import { postReply } from "@/api/services/forumPost.service";

import CommentItem from "@/components/Forum/CommentItem";
import CommentInput from "@/components/Forum/CommentInput";

interface ForumOverviewProps {
  post: ForumPostResponse;
  comments: ForumCommentsResponse[];
  refetchPost: () => Promise<void>;
}

LogBox.ignoreLogs([
  "TNodeChildrenRenderer: Support for defaultProps will be removed",
  "TRenderEngineProvider: Support for defaultProps",
  "MemoizedTNodeRenderer: Support for defaultProps",
]);

const ForumOverview: React.FC<ForumOverviewProps> = ({ post, comments, refetchPost }) => {
  const { user } = useGlobalContext();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const customMenuBarHeight = 100;
  const screenHeight = Dimensions.get("window").height;

  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [replyingTo, setReplyingTo] = useState<ForumCommentsResponse | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [scrollY, setScrollY] = useState(0);
  const [commentY, setCommentY] = useState(0);

  const showStickyInput = useMemo(() => {
    return commentY - scrollY < screenHeight * 0.7;
  }, [commentY, scrollY]);

  const images = post.images.map((img) => ({
    uri: img.imageUrl.toString().replace("/preview", "/view"),
  }));

  const openImage = (index: number) => {
    setCurrentIndex(index);
    setIsViewerVisible(true);
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      if (!user) return;
      await postReply(post, replyText, user, replyingTo?.$id);
      setReplyText("");
      setReplyingTo(null);
      await refetchPost();
    } catch (err) {
      console.error("Failed to post reply:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderReplyInput = () => (
    <CommentInput
      value={replyText}
      onChange={setReplyText}
      onSubmit={handleReplySubmit}
      onCancel={() => {
        setReplyText("");
        setReplyingTo(null);
      }}
      isReplyingTo={replyingTo?.$id}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <>
      <ScrollView
        onScroll={(e) => {
          setScrollY(e.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
        className="flex-1 bg-white px-6 pt-4"
        contentContainerStyle={{
          paddingBottom: insets.bottom + customMenuBarHeight + 48,
          paddingTop: 16,
        }}
      >
        {/* Title */}
        <Text className="mb-2 text-xl font-bold text-gray-900">{post.title}</Text>

        {/* Author */}
        <View className="mb-3 flex-row items-center gap-2">
          <Image source={{ uri: post.user.avatar.toString().replace("/preview", "/view") }} className="h-6 w-6 rounded-full" />
          <Text className="text-xs text-gray-500">
            {post.user.name} • {relativeDate(post.$createdAt)}
          </Text>
        </View>

        {/* Images */}
        <FlatList
          data={images}
          horizontal
          keyExtractor={(item, index) => `${item.uri}-${index}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 0 }}
          renderItem={({ item, index }) => (
            <Pressable onPress={() => openImage(index)}>
              <Image source={{ uri: item.uri }} className="mr-2 h-48 w-48 rounded-xl" resizeMode="cover" />
            </Pressable>
          )}
        />

        {/* Body */}
        <View className="mt-4">
          <RenderHTML contentWidth={width} source={{ html: post.body }} />
        </View>

        {/* Comments */}
        <Text onLayout={(e) => setCommentY(e.nativeEvent.layout.y)} className="mt-6 text-lg font-semibold text-gray-800">
          Comments ({comments?.flatMap((c) => [c, ...c.replies]).length || 0})
        </Text>

        {comments.length === 0 && <Text className="mt-2 text-gray-600">No comments yet.</Text>}

        {comments.map((comment) => (
          <CommentItem
            key={comment.$id}
            comment={comment}
            onReply={setReplyingTo}
            replyingTo={replyingTo}
            renderReplyInput={renderReplyInput}
          />
        ))}
      </ScrollView>

      {!replyingTo && showStickyInput && (
        <View style={{ paddingBottom: insets.bottom + customMenuBarHeight }} className="absolute bottom-0 left-0 right-0 bg-white px-6">
          <CommentInput value={replyText} onChange={setReplyText} onSubmit={handleReplySubmit} isSubmitting={isSubmitting} />
        </View>
      )}

      <ImageViewing
        images={images}
        imageIndex={currentIndex}
        visible={isViewerVisible}
        onRequestClose={() => setIsViewerVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
      />
    </>
  );
};

export default ForumOverview;
