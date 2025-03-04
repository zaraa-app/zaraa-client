import { View } from "react-native";
import React from "react";
import Heart from "@/assets/icons/heart.svg";
import Fire from "@/assets/icons/fire.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "@/utils/styles";
import TextContent from "../TextContent";
import InfoTab from "./InfoTab";
import { useGlobalContext } from "@/context/GlobalProvider";
import LogoutButton from "./LogoutButton";

export interface TopBarProps {
  pageType: "dashboard" | "leaderboard" | "forums" | "profile";
}

const TopBar = ({ pageType }: TopBarProps) => {
  const { user } = useGlobalContext();

  return (
    <SafeAreaView>
      <View style={[styles.px6, styles.py4]} className="flex-row items-center justify-between">
        <View className="w-full flex-1 flex-row justify-start" style={[styles.gap2]}>
          {pageType != "dashboard" ?
            <InfoTab content={user.streak.toString()} icon={<Fire />} />
          : null}
          {pageType === "dashboard" ?
            <View className="flex-1 rounded-full bg-neutral-1000" style={[styles.px4, styles.py3]}>
              <TextContent text="Category Select" className=" font-bold text-white" />
            </View>
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
