import { View, TextInput } from "react-native";
import React from "react";
import normalize from "@/utils/normalize";
import TextContent from "./TextContent";
import styles from "@/utils/styles";
import { cva } from "class-variance-authority";

interface FormFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  showPassword?: boolean;
  label?: string;
  placeholder?: string;
  keyboardType?: "default" | "decimal-pad" | "email-address" | "phone-pad";
  children?: React.ReactNode;
  textContentType?: "none" | "password" | "username" | "emailAddress" | "telephoneNumber" | "oneTimeCode";
  isPassword?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

const FormField = ({
  label,
  value,
  onValueChange,
  children,
  keyboardType = "default",
  placeholder = "",
  isPassword = false,
  showPassword = false,
  textContentType = "none",
  autoCapitalize = "none",
}: FormFieldProps) => {
  const textInputStyle = cva("flex-1 overflow-hidden rounded-lg border border-neutral-300 focus:border-primary-300");

  return (
    <View style={[styles.gap1]}>
      {label ?
        <TextContent size="sm" text={label} />
      : null}
      <View className="flex-row items-center" style={[styles.gap2]}>
        <TextInput
          className={textInputStyle()}
          selectionColor="rgba(109, 190, 69, 1)"
          showSoftInputOnFocus
          style={[styles.px2, { height: normalize(40) }]}
          placeholder={placeholder}
          secureTextEntry={isPassword && !showPassword}
          value={value}
          keyboardType={keyboardType}
          onChangeText={(newValue) => onValueChange(newValue)}
          textContentType={textContentType}
          autoCapitalize={autoCapitalize}
        />
        {children}
      </View>
    </View>
  );
};

export default FormField;
