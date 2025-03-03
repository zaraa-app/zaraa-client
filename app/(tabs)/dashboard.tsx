import React, { useEffect } from "react";
import ActionButton from "@/components/ActionButton";
import { logoutUser } from "@/api/services/user.service";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { View } from "react-native";
import styles from "@/utils/styles";

const Dashboard = () => {
  const { setUser, setIsLoggedIn, isLoggedIn } = useGlobalContext();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn]);

  /**
   * Handles the logout process. Logs out the user and catches any errors that may
   * occur.
   */
  async function handleLogout() {
    try {
      await logoutUser();
      setUser(null);
      setIsLoggedIn(false);

      router.replace("/");
    } catch (error: any) {
      console.log("Error logging out:", error.message);
    }
  }

  return (
    <SafeAreaView>
      <View style={[styles.gap8]}>
        <ActionButton title="All Set" onPress={() => router.replace("/all-set")} />
        <ActionButton title="Logout" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
