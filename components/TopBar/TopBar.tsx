import { Animated, View } from "react-native";
import React, { useEffect, useRef } from "react";
import Heart from "@/assets/icons/heart.svg";
import Fire from "@/assets/icons/fire.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "@/utils/styles";
import InfoTab from "./InfoTab";
import { useGlobalContext } from "@/context/GlobalProvider";
import LogoutButton from "./LogoutButton";
import CategorySelect from "../CategorySelect";
import { PageType } from "@/types/PageType.types";
import PageLoader from "../PageLoader/PageLoader";

export interface TopBarProps {
  pageType: PageType;
}

const TopBar = ({ pageType }: TopBarProps) => {
  const { user, isLoading } = useGlobalContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
