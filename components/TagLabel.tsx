import { TouchableOpacity, View } from "react-native";
import React from "react";
import TextContent, { TextSize } from "./TextContent";
import { cva } from "class-variance-authority";

export interface TagLabelProps {
  label: string;
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  size?: TextSize;
  textClasses?: string;
  onPress?: () => void;
}

const tagLabelStyle = cva("inline-flex items-center rounded-full", {
  variants: {
    size: {
      "3xs": "px-1.5 py-0.5",
      "2xs": "px-1.5 py-0.5",
      xs: "px-2 py-1",
      sm: "px-2.5 py-2",
      base: "px-2.5 py-1",
      md: "px-3 py-1.5",
      lg: "px-4 py-2",
      xl: "px-4 py-2",
    },
    color: {
      primary: "bg-primary-300",
      secondary: "bg-secondary-100",
      success: "bg-green-500",
      danger: "bg-red-500",
      warning: "bg-yellow-500",
      info: "bg-blue-500",
    },
  },
});

const textLabelStyle = cva("", {
  variants: {
    color: {
      primary: "text-white",
      secondary: "text-black",
      success: "text-white",
      danger: "text-white",
      warning: "text-white",
      info: "text-white",
    },
  },
});

const TagLabel = ({ label, color = "primary", size = "3xs", textClasses, onPress }: TagLabelProps) => {
  return (
    <TouchableOpacity className={tagLabelStyle({ color, size })} activeOpacity={onPress ? 0.8 : 1} onPress={onPress}>
      <TextContent size={size} className={`font-normal ${textClasses} ${textLabelStyle({ color })}`}>
        {label}
      </TextContent>
    </TouchableOpacity>
  );
};

export default TagLabel;
