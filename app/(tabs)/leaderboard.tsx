import React, { useState } from "react";
import { View, SafeAreaView, FlatList, Text, Image } from "react-native";
import TopThreeLeaderboard from "@/components/topThreeLeaderBoard";
import { UserResponse } from "@/api/types/user.types";
import LeaderboardItem from "@/components/LeaderboardItem";

const Leaderboard = () => {
  const [users] = useState<UserResponse[]>([
    {
      $id: "1",
      name: "John Doe",
      avatar: new URL("https://picsum.photos/200/200"),
      email: "p8e6o@example.com",
      hearts: 5,
      streak: 0,
      xp: 1450,
    } as UserResponse,
    {
      $id: "2",
      name: "Jane Doe",
      avatar: new URL("https://picsum.photos/200/200"),
      email: "v0i5m@example.com",
      hearts: 5,
      streak: 0,
      xp: 1562,
    } as UserResponse,
    {
      $id: "3",
      name: "Bob Smith",
      avatar: new URL("https://picsum.photos/200/200"),
      email: "i3z8v@example.com",
      hearts: 5,
      streak: 0,
      xp: 1652,
    } as UserResponse,
    {
      $id: "4",
      name: "Alice Johnson",
      avatar: new URL("https://picsum.photos/200/200"),
      email: "p8e6o@example.com",
      hearts: 5,
      streak: 0,
      xp: 3841,
    } as UserResponse,
    {
      $id: "5",
      name: "Michael Brown",
      avatar: new URL("https://picsum.photos/200/200"),
      email: "v0i5m@example.com",
      hearts: 5,
      streak: 0,
      xp: 4684,
    } as UserResponse,
    {
      $id: "6",
      name: "Sarah Lee",
      avatar: new URL("https://picsum.photos/200/200"),
      email: "i3z8v@example.com",
      hearts: 5,
      streak: 0,
      xp: 1564,
    } as UserResponse,
    {
      $id: "7",
      name: "David Kim",
      avatar: new URL("https://picsum.photos/200/200"),
      email: "p8e6o@example.com",
      hearts: 5,
      streak: 0,
      xp: 1235,
    } as UserResponse,
  ]);

  // Sort users by highest score (descending) and limit to 20 ranks
  const sortedUsers = [...users].sort((a, b) => b.xp - a.xp);
  const topThree = sortedUsers.slice(0, 3); // Get the top 3 users
  const remainingUsers: UserResponse[] = sortedUsers.slice(3); // Get the rest for the list

  return (
    <View className="h-full w-full bg-white">
      <FlatList
        data={remainingUsers}
        keyExtractor={(item) => item.$id}
        renderItem={({ item, index }) => <LeaderboardItem rank={index + 4} name={item.name} xp={item.xp} avatar={item.avatar} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Leaderboard;
