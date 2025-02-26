import { Text } from "react-native";
import React from "react";
import styles from "@/utils/styles";

interface TextContentProps {
  className?: string;
  style?: object;
  children?: React.ReactNode;
  text?: string;
  size?: "xs" | "2xs" | "3xs" | "base" | "sm" | "lg" | "xl";
}

const TextContent = ({ className, children, style, text, size = "base" }: TextContentProps) => {
  let textStyle = [];

  switch (size) {
    case "xs":
      textStyle = [styles.textXs, styles.leadingSnug];
      break;
    case "2xs":
      textStyle = [styles.text2xs, styles.leadingSnug];
      break;
    case "3xs":
      textStyle = [styles.text3xs, styles.leadingSnug];
      break;
    case "base":
      textStyle = [styles.textBase, styles.leadingLoose];
      break;
    case "sm":
      textStyle = [styles.textSm, styles.leadingSnug];
      break;
    case "lg":
      textStyle = [styles.textLg, styles.leadingRelaxed];
      break;
    case "xl":
      textStyle = [styles.textXl, styles.leadingRelaxed];
      break;
  }

  return (
    <Text style={[style, [...textStyle]]} className={`h-fit w-full font-inter ${className}`}>
      {children || text}
    </Text>
  );
};

export default TextContent;
