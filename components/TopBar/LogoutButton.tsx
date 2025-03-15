import { TouchableOpacity } from "react-native";
import React from "react";
import InfoTab from "./InfoTab";
import { Ionicons } from "@expo/vector-icons";
import normalize from "@/utils/normalize";
import { logoutUser } from "@/api/services/user.service";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";

const LogoutButton = () => {
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

      router.replace("/");
    } catch (error: any) {
      console.log("Error logging out:", error.message);
    }
  }

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handleLogout}>
      <InfoTab content="Logout" icon={<Ionicons name="log-out-outline" size={normalize(16)} color={"white"} />} />
    </TouchableOpacity>
  );
};

export default LogoutButton;
