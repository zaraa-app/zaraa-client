import { Animated, FlatList, TouchableOpacity, View } from "react-native";
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

const Forums = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [forums, setForums] = useState<ForumPostResponse[]>([]);
  const [filteredForums, setFilteredForums] = useState<ForumPostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchForumPosts = async () => {
      try {
        setIsLoading(true);

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

    fetchForumPosts();
  }, []);

  useEffect(() => {
    const filtered = forums.filter(
      (forum) =>
        forum.title.toLowerCase().includes(searchQuery.toLowerCase()) || forum.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredForums(filtered);
  }, [searchQuery, forums]);

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
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          renderItem={() => <TagLabel size="xs" color="secondary" label="Plant Care" />}
          showsHorizontalScrollIndicator={false}
          horizontal
        />
      </View>

      {filteredForums.length > 0 ?
        <FlatList
          style={[styles.px6]}
          contentContainerStyle={[styles.gap4]}
          data={filteredForums}
          renderItem={({ item }) => <ForumPost forum={item} />}
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
