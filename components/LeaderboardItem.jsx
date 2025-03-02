import React from "react";
import { View, Text, StyleSheet } from "react-native";

const LeaderboardItem = ({ rank, name, initials, score }) => {
  return (
    <View style={styles.container}>
      {/* Rank Number */}
      <Text style={styles.rank}>{rank}th</Text>

      {/* Profile Section */}
      <View style={styles.profile}>
        {/* Circle Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
      </View>

      {/* Score */}
      <Text style={styles.score}>{score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F1EC", // Matches bg-secondary-100
    padding: 12,
    borderRadius: 12,
    marginVertical: 5,
    borderWidth: 2,
    width: "90%",
    alignSelf: "center",
  },
  rank: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4D4D4D",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E6F4E6", // Matches bg-green-alpha-10
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  initials: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6ABF4B", // Matches text-green-200
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222222",
  },
  score: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6ABF4B",
  },
});

export default LeaderboardItem;
