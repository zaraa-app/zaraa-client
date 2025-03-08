import React, { useState } from "react";
import { View, SafeAreaView, FlatList } from "react-native";
import LeaderboardItem from "@/components/leaderBoardItem";
import TopThreeLeaderboard from "@/components/topThreeLeaderBoard";

const Leaderboard = () => {
  const [users] = useState([
    { id: "1", name: "John Doe", score: 3239, image: require("@/assets/images/blondeMan.png") }, 
    { id: "2", name: "Jane Doe", score: 2444, image: require("@/assets/images/yellowMan.png") },
    { id: "3", name: "Mahmoud Ahmad", score: 1824, image: require("@/assets/images/blackMan.png") },
    { id: "4", name: "Alice Johnson", score: 1540}, 
    { id: "5", name: "Bob Williams", score: 1490},
  ]);

  // Sort users by highest score (descending) and limit to 20 ranks
  const sortedUsers = [...users].sort((a, b) => b.score - a.score);
  const topThree = sortedUsers.slice(0, 3); // Get the top 3 users
  const remainingUsers = sortedUsers.slice(3); // Get the rest for the list

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Top 3 Users Display */}
      <TopThreeLeaderboard topThree={topThree} />

      {/* Rest of the leaderboard */}
      <View style={styles.listContainer}>
        <FlatList
          data={remainingUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <LeaderboardItem
              rank={index + 4} // Since the top 3 are already displayed
              name={item.name}
              initials={item.name.split(" ").map((n) => n[0]).join("")}
              score={item.score}
              image={item.image} // Pass image prop
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = {
  safeContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContainer: {
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
  },
};

export default Leaderboard;
