import { View, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HeadingContent from "@/components/HeadingContent";
import TextContent from "@/components/TextContent";
import styles from "@/utils/styles";
import FormField from "@/components/FormField";
import ActionButton from "@/components/ActionButton";
import { resetPassword } from "@/api/services/user.service";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={[styles.p8]} scrollEnabled={false}>
        <View className="flex-1 justify-start" style={[styles.gap4]}>
          <View>
            <HeadingContent size="h5" heading="Oops! Reset Time 🛠️" />
            <TextContent size="base" text="Forgot your password? Let's fix that!" />
          </View>
          <View style={[styles.gap4]}>
            <FormField
              label="Email"
              value={email}
              placeholder="johndoe@example.com"
              onValueChange={(newValue) => setEmail(newValue)}
              keyboardType="email-address"
            />
          </View>
          <TextContent
            size="xs"
            text="Enter the email you used to register your account, and we'll send you an email with instructions to reset your password."
            className="mt-2 leading-5 text-gray-500"
          />
        </View>
        <View style={[styles.gap2]}>
          <ActionButton title="Send Reset Link" onPress={() => resetPassword(email)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
