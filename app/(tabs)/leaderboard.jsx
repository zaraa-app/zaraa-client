import React, { useState } from "react";
import { View, SafeAreaView, FlatList } from "react-native";
import LeaderboardItem from "@/components/LeaderboardItem"; 

const Leaderboard = () => {
  const [users] = useState([
    { id: "1", name: "Yazan Kiswani", score: 1723 },
    { id: "2", name: "John Doe", score: 1650 },
    { id: "3", name: "Jane Smith", score: 1590 },
    { id: "4", name: "Alice Johnson", score: 1540 },
    { id: "5", name: "Bob Williams", score: 1490 },
    { id: "6", name: "Charlie Brown", score: 1400 },
    { id: "7", name: "David Green", score: 1350 },
    { id: "8", name: "Emma Wilson", score: 1300 },
    { id: "9", name: "Franklin Richards", score: 1250 },
    { id: "10", name: "Grace Hopper", score: 1200 },
    { id: "11", name: "Hannah Smith", score: 1180 },
    { id: "12", name: "Isaac Newton", score: 1150 },
    { id: "13", name: "Jennifer White", score: 1120 },
    { id: "14", name: "Kevin Hart", score: 1100 },
    { id: "15", name: "Liam Scott", score: 1080 },
    { id: "16", name: "Albert Fox", score: 1050 },
    { id: "17", name: "Noah Brown", score: 1030 },
    { id: "18", name: "Olivia Taylor", score: 1010 },
    { id: "19", name: "Patrick Star", score: 990 },
    { id: "20", name: "Quinn Martin", score: 970 },
    { id: "21", name: "Sean Roberts", score: 950 }
  ]);

  const sortedUsers = [...users].sort((a, b) => b.score - a.score).slice(0, 20);

  return (
    <SafeAreaView className="flex-1 items-center bg-neutral-100">
      <View className="w-11/12 max-w-md self-center">
        <FlatList
          data={sortedUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <LeaderboardItem
              rank={index + 1}
              name={item.name}
              initials={item.name.split(" ").map((n) => n[0]).join("")}
              score={item.score}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Leaderboard;
