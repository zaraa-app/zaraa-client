import { View } from "react-native";
import { useLinkBuilder } from "@react-navigation/native";
import { PlatformPressable } from "@react-navigation/elements";
import styles from "@/utils/styles";
import normalize from "@/utils/normalize";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import Dashboard from "@/assets/icons/dashboard.svg";
import Leaderboard from "@/assets/icons/leaderboard.svg";
import Forums from "@/assets/icons/forums.svg";
import Profile from "@/assets/icons/profile.svg";

import DashboardFocused from "@/assets/icons/dashboard-focused.svg";
import LeaderboardFocused from "@/assets/icons/leaderboard-focused.svg";
import ForumsFocused from "@/assets/icons/forums-focused.svg";
import ProfileFocused from "@/assets/icons/profile-focused.svg";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { selectionAsync } from "expo-haptics";

export interface MenuBarProps {
  isHidden?: boolean;
}

export const MenuBar = ({ state, navigation, isHidden }: BottomTabBarProps & MenuBarProps) => {
  const { buildHref } = useLinkBuilder();

  const menuBarIcons = {
    dashboard: { default: Dashboard, focused: DashboardFocused },
    leaderboard: { default: Leaderboard, focused: LeaderboardFocused },
    forums: { default: Forums, focused: ForumsFocused },
    profile: { default: Profile, focused: ProfileFocused },
  };

  if (isHidden) {
    return null;
  }

  return (
    <View className="absolute bottom-10 flex-row items-center justify-between rounded-full bg-neutral-1000" style={[styles.mx6, styles.p2]}>
      <View className="w-full flex-1 flex-row justify-between">
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { default: DefaultIcon, focused: FocusedIcon } = menuBarIcons[route.name as keyof typeof menuBarIcons] || {};

          if (!DefaultIcon || !FocusedIcon) return null;

          const IconComponent = isFocused ? FocusedIcon : DefaultIcon;

          const scale = useSharedValue(isFocused ? 1.1 : 1);

          const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: withTiming(scale.value, { duration: 200 }) }],
          }));

          const onPress = () => {
            selectionAsync();
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          scale.value = isFocused ? 1.1 : 1;

          return (
            <PlatformPressable
              href={buildHref(route.name, route.params)}
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              className="items-center justify-center"
            >
              <View
                style={[{ minHeight: normalize(52) }, isFocused ? { backgroundColor: "rgba(109, 190, 69, 1)" } : {}]}
                className="aspect-square items-center justify-center rounded-full"
              >
                <Animated.View style={animatedStyle}>
                  <IconComponent width={normalize(24)} height={normalize(24)} />
                </Animated.View>
              </View>
            </PlatformPressable>
          );
        })}
      </View>
    </View>
  );
};
