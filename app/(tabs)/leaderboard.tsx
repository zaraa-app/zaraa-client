import React, { useCallback, useState } from "react";
import { View, FlatList } from "react-native";
import TopThreeLeaderboard from "@/components/topThreeLeaderBoard";
import LeaderboardItem from "@/components/LeaderboardItem";
import { getAllUsers } from "@/api/services/user.service";
import { UserResponse } from "@/api/types/user.types";
import styles from "@/utils/styles";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Leaderboard = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchUsers = async () => {
        setLoading(true);
        try {
          const userData = await getAllUsers();
          if (isActive) {
            setUsers(userData);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchUsers();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // Sort users and separate top three
  const topThree = users.slice(0, 3);
  const remainingUsers = users.slice(3);

  return (
    <View className="flex-1 bg-white">
      {/* Non-scrollable header */}
      <View>
        <TopThreeLeaderboard topThree={topThree} />
      </View>

      {/* Scrollable leaderboard items */}
      <View className="flex-1" style={[styles.px6]}>
        <FlatList
          data={remainingUsers}
          style={[styles.pt4]}
          keyExtractor={(item) => item.$id}
          renderItem={({ item, index }) => (
            <View className={index !== users.slice(3).length - 1 ? "mb-2" : ""}>
              <LeaderboardItem rank={index + 4} name={item.name} xp={item.xp} avatar={item.avatar} />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        />
      </View>
    </View>
  );
};

export default Leaderboard;
