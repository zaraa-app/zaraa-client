import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import { PageType } from "@/types/PageType.types";
import styles from "@/utils/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Shimmer from "../Shimmer";
import normalize from "@/utils/normalize";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import HeadingContent from "../HeadingContent";
import TextContent from "../TextContent";

export interface PageLoaderProps {
  pageType: PageType | "topbar";
}

const PageLoader = ({ pageType }: PageLoaderProps) => {
  switch (pageType) {
    case "topbar":
      return <TopBarSkeleton />;
    case "dashboard":
      return <DashboardSkeleton />;
    case "forums":
      return <ForumsSkeleton />;
    case "quiz/[lessonId]":
      return <QuizPageSkeleton />;
  }

  return (
    <View>
      <Text>PageLoader</Text>
    </View>
  );
};

const QuizPageSkeleton = () => (
  <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-primary-300 px-4 pt-4">
    <View className="flex-1 gap-4 rounded-3xl bg-white p-4">
      {/* top row: close icon + progress track */}
      <View className="flex-row">
        <Shimmer className="h-12 w-full rounded-full" />
      </View>

      {/* question text */}
      <Shimmer className="w-full self-center rounded-xl" />

      {/* four answer options */}
      <View className="flex-1 justify-between gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Shimmer key={i} className="w-full rounded-xl" style={{ height: normalize(56) }} />
        ))}
      </View>

      {/* submit / next button */}
      <View className="h-24">
        <Shimmer className="w-full rounded-full" style={{ height: normalize(56) }} />
      </View>
    </View>
  </SafeAreaView>
);

const TopBarSkeleton = () => {
  return (
    <SafeAreaView edges={["top"]}>
      <View style={[styles.px6, styles.pt4, styles.gap16]} className="flex-row items-center justify-between">
        <Shimmer className="min-h-[45px]" />
        <View className="w-full flex-1 flex-row justify-start" style={[styles.gap2]}>
          <Shimmer className="min-h-[45px]" />
          <Shimmer className="min-h-[45px]" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const DashboardSkeleton = () => {
  return (
    <View className="h-full w-full flex-1" style={[styles.pb6, { marginBottom: normalize(92) }]}>
      <View style={[{ height: normalize(64) }, styles.pt4, styles.px6]}>
        <Shimmer className="flex-0 rounded-full" />
      </View>
      <ScrollView
        horizontal
        contentContainerClassName="items-center"
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={[styles.px6]}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <Shimmer
            className="flex-0 rounded-full"
            key={index}
            style={{ height: normalize(88), width: normalize(88), marginTop: index % 2 !== 0 ? normalize(100) : normalize(-100) }}
          />
        ))}
      </ScrollView>
      <View style={[styles.px6]}>
        <View style={[{ minHeight: normalize(200) }]}>
          <Shimmer className="w-full !rounded-3xl" />
        </View>
      </View>
    </View>
  );
};

const ForumsSkeleton = () => {
  return (
    <View className="w-full" style={[styles.mt2]}>
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
          <Shimmer style={[styles.gap1, styles.p6]} />
        </View>
        <FlatList
          style={[styles.px6]}
          contentContainerStyle={[styles.gap1]}
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          renderItem={() => <Shimmer style={[styles.py3, styles.px8]} />}
          showsHorizontalScrollIndicator={false}
          horizontal
        />
      </View>
      <FlatList
        style={[styles.px6]}
        contentContainerStyle={[styles.gap4]}
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        renderItem={() => <Shimmer style={[styles.py16]} className="!rounded-3xl" />}
      />
    </View>
  );
};

export default PageLoader;
