import React from "react";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, View } from "react-native";
import styles from "@/utils/styles";
import normalize from "@/utils/normalize";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        header: () => {
          return (
            <SafeAreaView className="w-full">
              <View className="w-full" style={[styles.px8, styles.py4]}>
                <Ionicons
                  name="arrow-back"
                  size={normalize(24)}
                  color="rgba(109, 190, 69, 1)"
                  onPress={router.back}
                  suppressHighlighting={true}
                />
              </View>
            </SafeAreaView>
          );
        },
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
};
export default AuthLayout;
