import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, ScrollView } from "react-native";
import TopThreeLeaderboard from "@/components/topThreeLeaderBoard";
import { UserResponse } from "@/api/types/user.types";
import LeaderboardItem from "@/components/LeaderboardItem";
import { Client, Databases } from "appwrite";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_DATABASE_ID, APPWRITE_USERS_TABLE_ID } from "@env";

const Leaderboard = () => {
  // State for users and loading
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize Appwrite
  const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
  const databases = new Databases(client);

  // Fetch all users from Appwrite
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await databases.listDocuments(APPWRITE_DATABASE_ID, APPWRITE_USERS_TABLE_ID);

        if (response.documents.length > 0) {
          setUsers(response.documents as UserResponse[]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Sort users by XP and filter the top 20
  const sortedUsers = [...users].sort((a, b) => b.xp - a.xp).slice(0, 20);
  const topThree = sortedUsers.slice(0, 3);
  const remainingUsers = sortedUsers.slice(3);

  return (
    <View className="flex-1 bg-white">
      {/* Show loading indicator while fetching data */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6ABF4B" />
        </View>
      ) : (
        <ScrollView className="flex-1">
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
                    rank={index + 4}
                    name={item.name}
                    xp={item.xp}
                    avatar={item.avatar}
                  />
                </View>
              )}
              scrollEnabled={false} // 🔹 Prevent FlatList from scrolling separately
              showsVerticalScrollIndicator={false}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Leaderboard;
