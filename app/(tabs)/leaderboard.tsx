import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, ScrollView } from "react-native";
import TopThreeLeaderboard from "@/components/topThreeLeaderBoard";
import LeaderboardItem from "@/components/LeaderboardItem";
import { getAllUsers } from "@/api/services/user.service";
import { UserResponse } from "@/api/types/user.types";

const Leaderboard = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from the service
  useEffect(() => {
    const fetchUsers = async () => {
      const userData = await getAllUsers();
      setUsers(userData);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // Sort users and separate top three
  const topThree = users.slice(0, 3);
  const remainingUsers = users.slice(3);

  return (
    <View className="flex-1 bg-white">
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6ABF4B" />
          
        </View>
      ) : (
        <ScrollView className="flex-1">
          <TopThreeLeaderboard topThree={topThree} />

          <View className="p-6">
            <FlatList
              data={remainingUsers}
              keyExtractor={(item) => item.$id}
              renderItem={({ item, index }) => (
                <View className={index !== remainingUsers.length - 1 ? "mb-2" : ""}>
                  <LeaderboardItem rank={index + 4} name={item.name} xp={item.xp} avatar={item.avatar} />
                </View>
              )}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Leaderboard;
