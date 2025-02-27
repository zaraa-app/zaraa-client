import { View, SafeAreaView, ScrollView } from "react-native";
import React, { useState } from "react";
import ActionButton from "@/components/ActionButton";
import FormField from "@/components/FormField";
import HeadingContent from "@/components/HeadingContent";
import TextContent from "@/components/TextContent";
import normalize from "@/utils/normalize";
import styles from "@/utils/styles";
import { Ionicons } from "@expo/vector-icons";

const SignInView = () => {
  const [accountDetails, setAccountDetails] = useState({
    email: "",
    password: "",
  });

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={[styles.p8]} scrollEnabled={false}>
        <View className="flex-1 justify-end" style={[styles.gap12]}>
          <View style={[styles.gap4]}>
            <View>
              <HeadingContent size="h5" heading="Welcome Back! 👋" />
              <TextContent size="base" text="Sign in to continue." />
            </View>
            <View style={[styles.gap4]}>
              <FormField
                label="Email"
                value={accountDetails.email}
                placeholder="johndoe@example.com"
                onValueChange={(newValue) => setAccountDetails({ ...accountDetails, email: newValue })}
                keyboardType="email-address"
              />
              <FormField
                label="Password"
                value={accountDetails.password}
                onValueChange={(newValue) => setAccountDetails({ ...accountDetails, password: newValue })}
                placeholder="Password"
                isPassword
              />
              <View className="w-full flex-row" style={[styles.gap1]}>
                <TextContent size="xs" text="Forgot your password?" className="text-neutral-900" />
                <TextContent
                  size="xs"
                  text="Reset Password"
                  className="text-blue-500 underline"
                  onPress={() => console.log("Implement me please.")}
                />
              </View>
            </View>
          </View>
          <View style={[styles.gap2]}>
            <ActionButton title="Sign In" onPress={() => console.log("test")} />
            <ActionButton
              title="Sign In with Google"
              onPress={() => console.log("test")}
              leftIcon={<Ionicons name="logo-google" size={normalize(20)} color="rgba(109,190,69,1)" />}
              isOutline
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignInView;
