import React, { useState } from "react";
import { View, SafeAreaView, FlatList } from "react-native";
import TopThreeLeaderboard from "@/components/topThreeLeaderBoard";
import { UserResponse } from "@/api/types/user.types";
import LeaderboardItem from "@/components/LeaderboardItem";
import styles from "@/utils/styles";

const Leaderboard = () => {
  const [users] = useState<UserResponse[]>([
    {
      $id: "1",
      name: "John Doe",
      avatar: "https://picsum.photos/200/200", 
      email: "p8e6o@example.com",
      hearts: 5,
      streak: 0,
      xp: 1450,
    },
    {
      $id: "2",
      name: "Jane Doe",
      avatar: "https://picsum.photos/200/200",
      email: "v0i5m@example.com",
      hearts: 5,
      streak: 0,
      xp: 1562,
    },
    {
      $id: "3",
      name: "Bob Smith",
      avatar: "https://picsum.photos/200/200",
      email: "i3z8v@example.com",
      hearts: 5,
      streak: 0,
      xp: 1652,
    },
    {
      $id: "4",
      name: "Alice Johnson",
      avatar: "https://picsum.photos/200/200",
      email: "p8e6o@example.com",
      hearts: 5,
      streak: 0,
      xp: 3841,
    },
    {
      $id: "5",
      name: "Michael Brown",
      avatar: "https://picsum.photos/200/200",
      email: "v0i5m@example.com",
      hearts: 5,
      streak: 0,
      xp: 4684,
    },
    {
      $id: "6",
      name: "Sarah Lee",
      avatar: "https://picsum.photos/200/200",
      email: "i3z8v@example.com",
      hearts: 5,
      streak: 0,
      xp: 1564,
    },
    {
      $id: "7",
      name: "David Kim",
      avatar: "https://picsum.photos/200/200",
      email: "p8e6o@example.com",
      hearts: 5,
      streak: 0,
      xp: 1235,
    },
  ]);

  // Sort users by highest XP and split into top 3 and remaining
  const sortedUsers = [...users].sort((a, b) => b.xp - a.xp);
  const topThree = sortedUsers.slice(0, 3);
  const remainingUsers = sortedUsers.slice(3);

  return (
    <View className="h-full w-full bg-white">
      {/* 🔹 Include the Top 3 Leaderboard */}
      <TopThreeLeaderboard topThree={topThree} />

      {/* 🔹 List for Remaining Users */}
      <View className="p-6">
        <FlatList
          data={remainingUsers}
          keyExtractor={(item) => item.$id}
          renderItem={({ item, index }) => (
            <View className={index !== remainingUsers.length - 1 ? "mb-2" : ""}>
              <LeaderboardItem
                rank={index + 4} // Since top 3 are already displayed
                name={item.name}
                xp={item.xp}
                avatar={item.avatar} // ✅ Pass the image properly
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default Leaderboard;
