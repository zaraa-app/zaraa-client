import { View, TextInput } from "react-native";
import React from "react";
import normalize from "@/utils/normalize";
import styles from "@/utils/styles";
import { cva } from "class-variance-authority";
import { Ionicons } from "@expo/vector-icons";

export interface ForumSearchProps {
  value: string;
  onValueChange: (value: string) => void;
}

const ForumSearch = ({ value, onValueChange }: ForumSearchProps) => {
  const textInputStyle = cva("flex-row items-center justify-start bg-secondary-100 rounded-full", {
    variants: {},
  });

  return (
    <View className={textInputStyle()} style={[styles.gap1, styles.p4]}>
      <Ionicons name="search" size={normalize(14)} color={"rgba(187, 187, 187, 1)"} />
      <TextInput
        className="flex-1"
        selectionColor="rgba(109, 190, 69, 1)"
        showSoftInputOnFocus
        placeholder={"Search..."}
        value={value}
        onChangeText={(newValue) => onValueChange(newValue)}
        enablesReturnKeyAutomatically
      />
    </View>
  );
};

export default ForumSearch;
