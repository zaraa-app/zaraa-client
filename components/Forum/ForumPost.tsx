import { View, Image, FlatList } from "react-native";
import React from "react";
import normalize from "@/utils/normalize";
import { Ionicons } from "@expo/vector-icons";
import styles from "@/utils/styles";
import TextContent from "../TextContent";
import TagLabel from "../TagLabel";
import { ForumPostResponse } from "@/api/types/forumPost.types";

export interface ForumPostProps {
  forum: ForumPostResponse;
}

/**
 * Returns a relative date string from a given date or date string.
 * If the given date is in the past, the string will be in the form of "X time unit(s) ago".
 * If the given date is in the future, the string will be in the form of "in X time unit(s)".
 * If the given date is the same as the current date, the string will be "just now".
 * @param date The date to be converted to a relative date string.
 * @returns A relative date string.
 */
export const relativeDate = (date: string | Date) => {
  const now = new Date();
  const dateObject = typeof date === "string" ? new Date(date) : date;
  const diff = now.getTime() - dateObject.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (seconds > 0) {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  } else {
    return "just now";
  }
};

const ForumPost = ({ forum }: ForumPostProps) => {
  return (
    <View
      style={[{ minHeight: normalize(140), maxHeight: normalize(200) }, styles.p3, styles.gap3]}
      className="flex-row rounded-3xl bg-secondary-100"
    >
      <Image
        src={"https://picsum.photos/536/354"}
        style={[{ width: normalize(88) }]}
        className="h-full overflow-hidden rounded-xl"
        resizeMode="cover"
      />
      <View className="flex-1 justify-between" style={[styles.gap2]}>
        <View className="flex-row" style={[styles.gap1]}>
          <FlatList
            data={forum.tags}
            renderItem={({ item }) => <TagLabel label={item.name} />}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View className="flex-1">
          <TextContent size="sm" className="font-bold" text={forum.title} numberOfLines={2} />
          <TextContent size="2xs" className="text-gray-700" text={forum.body} numberOfLines={3} />
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center" style={[styles.gap1]}>
            <Image
              className="overflow-hidden rounded-full"
              style={{ height: normalize(16), width: normalize(16) }}
              source={{ uri: forum.user.avatar.toString() }}
            />
            <TextContent size="2xs" text={forum.user.name.split(" ")[0]} className="" />
            <TextContent size="3xs" text={relativeDate(forum.$createdAt)} className="font-light italic" />
          </View>
          <View className="flex-row" style={[styles.gap1]}>
            <View
              className="flex-row items-center justify-center rounded-full bg-neutral-1000"
              style={[styles.gap1, styles.px1, { paddingVertical: normalize(2) }]}
            >
              <Ionicons name="chatbox-outline" size={normalize(10)} color={"white"} />
              <TextContent size="2xs" text={"2"} className="text-white" />
            </View>
            <View
              className="flex-row items-center justify-center rounded-full bg-neutral-1000"
              style={[styles.gap1, styles.px1, { paddingVertical: normalize(2) }]}
            >
              <Ionicons name="share-outline" size={normalize(10)} color={"white"} />
              <TextContent size="2xs" text={"Share"} className="text-white" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ForumPost;
