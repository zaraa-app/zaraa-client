import { Animated, FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import PageLoader from "@/components/PageLoader/PageLoader";
import { getAllForumPosts } from "@/api/services/forumPost.service";
import { TagResponse } from "@/api/types/tag.types";
import { getAllTags } from "@/api/services/tag.service";

const Forums = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [forums, setForums] = useState<ForumPostResponse[]>([]);
  const [filteredForums, setFilteredForums] = useState<ForumPostResponse[]>([]);
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchForumPosts = async () => {
    try {
      const data = await getAllForumPosts();
      setForums(data);
      setFilteredForums(data);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
    } finally {
      setIsLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const fetchTags = async () => {
    try {
      const data = await getAllTags();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchTags();
    fetchForumPosts();
  }, []);

  useEffect(() => {
    const filtered = forums.filter((forum) => {
      const hasMatchingTag = selectedTags.length ? forum.tags.some((t) => selectedTags.includes(t.name)) : true;
      const hasMatchingSearchQuery =
        searchQuery === "" ||
        forum.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        forum.body.toLowerCase().includes(searchQuery.toLowerCase());

      return hasMatchingTag && hasMatchingSearchQuery;
    });
    setFilteredForums(filtered);
  }, [searchQuery, forums, selectedTags]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchForumPosts();
    fetchTags();
    setIsRefreshing(false);
  };

  const filterByTags = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
      return;
    }

    setSelectedTags([tag, ...selectedTags]);
  };

  if (isLoading) {
    return <PageLoader pageType="forums" />;
  }

  return (
    <Animated.View style={[styles.pt2, { opacity: fadeAnim }]}>
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
          data={tags}
          renderItem={({ item }) => (
            <TagLabel
              size="xs"
              color={selectedTags.includes(item.name) ? "primary" : "secondary"}
              label={item.name}
              onPress={() => filterByTags(item.name)}
            />
          )}
          showsHorizontalScrollIndicator={false}
          horizontal
        />
      </View>

      {filteredForums.length > 0 ?
        <FlatList
          style={[styles.px6]}
          contentContainerClassName="h-full"
          contentContainerStyle={[styles.gap4]}
          data={filteredForums}
          renderItem={({ item }) => <ForumPost forum={item} />}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        />
      : <View className="mt-24 w-full items-center justify-center" style={[styles.gap2]}>
          <Ionicons name="notifications-outline" size={normalize(40)} color={"rgba(0, 0, 0, 0.15)"} />
          <HeadingContent size="h6" className="text-center !font-bold text-neutral-200" heading="No Forums Found" />
        </View>
      }
    </Animated.View>
  );
};

export default Forums;
