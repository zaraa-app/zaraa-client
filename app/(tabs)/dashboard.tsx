import React from "react";
import ActionButton from "@/components/ActionButton";
import { logoutUser } from "@/api/services/user.service";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";

const Dashboard = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();

  /**
   * Handles the logout process. Logs out the user and catches any errors that may
   * occur.
   */
  async function handleLogout() {
    try {
      await logoutUser();
      setUser(null);
      setIsLoggedIn(false);

      router.push("/");
    } catch (error: any) {
      console.error("Error logging out:", error.message);
    }
  }

  return (
    <SafeAreaView>
      <ActionButton title="Logout" onPress={handleLogout} />
    </SafeAreaView>
  );
};

export default Dashboard;
