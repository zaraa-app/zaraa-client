import React, { useState } from "react";
import { View, Text, Image, FlatList, Pressable, ScrollView } from "react-native";
import { ForumPostResponse } from "@/api/types/forumPost.types";
import ImageViewing from "react-native-image-viewing";
import { relativeDate } from "@/components/Forum/ForumPost";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogBox } from "react-native";

interface ForumOverviewProps {
  post: ForumPostResponse;
}

LogBox.ignoreLogs([
  "TNodeChildrenRenderer: Support for defaultProps will be removed",
  "TRenderEngineProvider: Support for defaultProps",
  "MemoizedTNodeRenderer: Support for defaultProps",
]);

const ForumOverview: React.FC<ForumOverviewProps> = ({ post }) => {
  const { width } = useWindowDimensions();

  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = post.images.map((img) => ({
    uri: img.imageUrl.toString().replace("/preview", "/view"),
  }));

  const openImage = (index: number) => {
    setCurrentIndex(index);
    setIsViewerVisible(true);
  };

  const insets = useSafeAreaInsets();
  const customMenuBarHeight = 100;

  return (
    <>
      <ScrollView
        className="flex-1 bg-white px-6 pt-4"
        contentContainerStyle={{
          paddingBottom: insets.bottom + customMenuBarHeight,
          paddingTop: 16,
        }}
      >
        {/* Title */}
        <Text className="mb-2 text-xl font-bold text-gray-900">{post.title}</Text>

        {/* Author */}
        <View className="mb-4 flex-row items-center gap-2">
          <Image source={{ uri: post.user.avatar.toString().replace("/preview", "/view") }} className="h-6 w-6 rounded-full" />
          <Text className="text-sm text-gray-600">
            {post.user.name} • {relativeDate(post.$createdAt)}
          </Text>
        </View>

        {/* Images */}
        <View>
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
        </View>

        <View className="mt-4">
          <RenderHTML contentWidth={width} source={{ html: post.body }} />
        </View>

        {/* Comments */}
        <Text className="mt-6 text-lg font-semibold text-gray-800">Comments ({post.comments?.length || 0})</Text>
        {!post.comments?.length && <Text className="mt-2 text-gray-600">No comments yet.</Text>}
      </ScrollView>
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
