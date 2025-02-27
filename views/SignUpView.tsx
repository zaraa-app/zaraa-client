import { View, Text, SafeAreaView, ScrollView, TextInput } from "react-native";
import React, { useRef, useState } from "react";
import ActionButton from "@/components/ActionButton";
import FormField from "@/components/FormField";
import HeadingContent from "@/components/HeadingContent";
import TextContent from "@/components/TextContent";
import normalize from "@/utils/normalize";
import styles from "@/utils/styles";
import { Ionicons } from "@expo/vector-icons";

const SignUpView = () => {
  const passwordRequirements = ["Atleast 1 uppercase letter", "At least 1 number", "Atleast 8 characters"];

  const [accountDetails, setAccountDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[] | undefined>(undefined);

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  function handleNewPassword(newValue: string) {
    setAccountDetails({ ...accountDetails, password: newValue });
    validatePassword(newValue);
  }

  function handlePasswordConfirmation(newValue: string) {
    setConfirmedPassword(newValue);
  }

  function validatePassword(password: string) {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push("Atleast 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Atleast 1 uppercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("At least 1 number");
    }

    setPasswordErrors(errors);
  }

  function isRequirementMet(requirement: string) {
    if (!passwordErrors) return false;
    return !passwordErrors.includes(requirement);
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={[styles.p8]} scrollEnabled={false}>
        <View className="flex-1 justify-start" style={[styles.gap4]}>
          <View>
            <HeadingContent size="h5" heading="Let’s Get Growing! 🌱" />
            <TextContent size="base" text="Create your own account." />
          </View>
          <View style={[styles.gap4]}>
            <FormField
              label="Name"
              placeholder="John Doe"
              value={accountDetails.name}
              onValueChange={(newValue) => setAccountDetails({ ...accountDetails, name: newValue })}
              autoCapitalize="words"
              onSubmitEditing={() => emailInputRef.current?.focus()}
            />
            <FormField
              ref={emailInputRef}
              label="Email"
              placeholder="johndoe@example.com"
              value={accountDetails.email}
              keyboardType="email-address"
              onValueChange={(newValue) => setAccountDetails({ ...accountDetails, email: newValue })}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />
            <View className="flex w-full" style={[styles.gap2]}>
              <FormField
                ref={passwordInputRef}
                label="Password"
                placeholder="Password"
                value={accountDetails.password}
                showPassword={showPassword}
                onValueChange={(newValue) => handleNewPassword(newValue)}
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                textContentType="oneTimeCode"
                isPassword
              >
                <Ionicons
                  name={!showPassword ? "eye" : "eye-off"}
                  size={24}
                  color="rgba(109, 190, 69, 1)"
                  onPress={() => setShowPassword(!showPassword)}
                  suppressHighlighting
                />
              </FormField>
              <FormField
                ref={confirmPasswordInputRef}
                placeholder="Confirm Password"
                value={confirmedPassword}
                onValueChange={(newValue) => handlePasswordConfirmation(newValue)}
                textContentType="oneTimeCode"
                isPassword
              />
              <View className="flex w-full" style={[styles.gap2, styles.mt2]}>
                {passwordRequirements.map((requirement, index) => (
                  <View key={index} className="items-centers flex-row" style={[styles.gap1]}>
                    <Ionicons
                      name={
                        !passwordErrors ? "information-circle"
                        : isRequirementMet(requirement) ?
                          "checkmark-circle-outline"
                        : "close-circle-outline"
                      }
                      size={18}
                      color={
                        !passwordErrors ? "rgba(164, 164, 164, 1)"
                        : isRequirementMet(requirement) ?
                          "rgba(109,190,69,1)"
                        : "red"
                      }
                    />

                    <Text style={[styles.textSm]} className="text-neutral-500">
                      {requirement}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.gap2]}>
          <ActionButton
            title="Next"
            onPress={() => console.log("test")}
            rightIcon={<Ionicons name="arrow-forward" color="white" size={normalize(20)} />}
          />
          <ActionButton
            title="Sign up with Google"
            onPress={() => console.log("test")}
            leftIcon={<Ionicons name="logo-google" size={normalize(20)} color="rgba(109,190,69,1)" />}
            isOutline
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpView;
