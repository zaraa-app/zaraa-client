import React from "react";
import { Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";

import Images from "@/constants/Images";
import TextContent from "@/components/TextContent";
import HeadingContent from "@/components/HeadingContent";
import normalize from "@/utils/normalize";
import styles from "@/utils/styles";
import ActionButton from "@/components/ActionButton";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function Index() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/dashboard" />;

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView contentContainerStyle={{ height: "100%" }} scrollEnabled={false}>
        <View className="flex h-full items-center justify-between" style={[styles.p8, styles.pt16]}>
          <View className="flex w-full items-center justify-center">
            <Image source={Images.mascot} />
            <HeadingContent size="h5">Let's Get Growing! 🌱</HeadingContent>
            <TextContent style={{ fontSize: normalize(16) }}>Discover the joy of nurturing plants, one leaf at a time!</TextContent>
          </View>
          <View className="flex w-full flex-row items-center justify-center" style={[styles.gap4]}>
            <View className="rounded-full bg-primary-300" style={{ height: normalize(12), width: normalize(12) }} />
            <View className="rounded-full bg-gray-200" style={{ height: normalize(12), width: normalize(12) }} />
            <View className="rounded-full bg-gray-200" style={{ height: normalize(12), width: normalize(12) }} />
          </View>
          <View className="flex w-full items-center justify-center gap-2">
            <ActionButton title="Start My Journey" onPress={() => router.push("/sign-up")} />
            <ActionButton title="I already have an account" onPress={() => router.push("/sign-in")} isOutline />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
