import { View } from "react-native";
import React from "react";
import TextContent from "./TextContent";
import { cva } from "class-variance-authority";

export interface TagLabelProps {
  label: string;
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
}

const tagLabelStyle = cva("inline-flex items-center px-2.5 py-0.5 rounded-full", {
  variants: {
    color: {
      primary: "bg-primary-300",
      secondary: "bg-secondary-300",
      success: "bg-green-500",
      danger: "bg-red-500",
      warning: "bg-yellow-500",
      info: "bg-blue-500",
    },
  },
});

const TagLabel = ({ label, color = "primary" }: TagLabelProps) => {
  return (
    <View className={tagLabelStyle({ color })}>
      <TextContent size="3xs" className="text-white">
        {label}
      </TextContent>
    </View>
  );
};

export default TagLabel;
