import { Animated, View, Pressable, Text } from "react-native";
import React, { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import styles from "@/utils/styles";
import Heart from "@/assets/icons/heart.svg";
import Fire from "@/assets/icons/fire.svg";
import InfoTab from "./InfoTab";
import LogoutButton from "./LogoutButton";
import CategorySelect from "../CategorySelect";
import { PageType } from "@/types/PageType.types";
import PageLoader from "../PageLoader/PageLoader";
import { useGlobalContext } from "@/context/GlobalProvider";

export interface TopBarProps {
  pageType: PageType;
}

const TopBar = ({ pageType }: TopBarProps) => {
  const { user, isLoading } = useGlobalContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isLoading]);

  if (!user || isLoading) {
    return <PageLoader pageType="topbar" />;
  }

  if (pageType === "back") {
    return (
      <SafeAreaView edges={["top"]}>
        <View className="px-6 pt-4">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className={pageType === "leaderboard" ? "bg-primary-300" : ""}>
      <Animated.View style={[styles.px6, styles.pt4, { opacity: fadeAnim }]} className="flex-row items-center justify-between">
        <View className="w-full flex-1 flex-row justify-start" style={[styles.gap2]}>
          {pageType != "dashboard" ?
            <InfoTab content={user.streak.toString()} icon={<Fire />} />
          : null}
          {pageType === "dashboard" ?
            <CategorySelect />
          : null}
        </View>
        <View className="w-full flex-1 flex-row justify-end" style={[styles.gap2]}>
          {pageType === "dashboard" ?
            <InfoTab content={user.streak.toString()} icon={<Fire />} />
          : null}
          <InfoTab content={user.hearts.toString()} icon={<Heart />} />
          {pageType === "profile" ?
            <LogoutButton />
          : null}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default TopBar;
