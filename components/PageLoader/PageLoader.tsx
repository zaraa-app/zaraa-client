import { View, Text, ScrollView } from "react-native";
import React from "react";
import { PageType } from "@/types/PageType.types";
import styles from "@/utils/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Shimmer from "../Shimmer";
import normalize from "@/utils/normalize";

export interface PageLoaderProps {
  pageType: PageType | "topbar";
}

const PageLoader = ({ pageType }: PageLoaderProps) => {
  switch (pageType) {
    case "topbar":
      return <TopBarSkeleton />;
    case "dashboard":
      return <DashboardSkeleton />;
  }

  return (
    <View>
      <Text>PageLoader</Text>
    </View>
  );
};

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

export default PageLoader;
