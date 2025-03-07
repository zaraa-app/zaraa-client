import { View } from "react-native";
import React from "react";
import Heart from "@/assets/icons/heart.svg";
import Fire from "@/assets/icons/fire.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "@/utils/styles";
import InfoTab from "./InfoTab";
import { useGlobalContext } from "@/context/GlobalProvider";
import LogoutButton from "./LogoutButton";
import CategorySelect from "../CategorySelect";

export interface TopBarProps {
  pageType: "dashboard" | "leaderboard" | "forums" | "profile";
}

const TopBar = ({ pageType }: TopBarProps) => {
  const { user } = useGlobalContext();

  return (
    <SafeAreaView edges={["top"]}>
      <View style={[styles.px6, styles.pt4]} className="flex-row items-center justify-between">
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
      </View>
    </SafeAreaView>
  );
};

export default TopBar;
