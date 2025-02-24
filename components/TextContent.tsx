import { Text } from "react-native";
import React from "react";

interface TextContentProps {
  className?: string;
  children: React.ReactNode;
}

const TextContent = ({ className, children }: TextContentProps) => {
  return <Text className={`font-inter w-full ${className}`}>{children}</Text>;
};

export default TextContent;
