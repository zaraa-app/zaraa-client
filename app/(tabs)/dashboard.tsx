import React, { useEffect } from "react";
import ActionButton from "@/components/ActionButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { View } from "react-native";
import styles from "@/utils/styles";

const Dashboard = () => {
  const { isLoggedIn } = useGlobalContext();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
    }
  }, [isLoggedIn]);

  return (
    <SafeAreaView>
      <View style={[styles.gap8]}></View>
    </SafeAreaView>
  );
};

export default Dashboard;
