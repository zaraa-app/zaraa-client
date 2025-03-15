import { Text } from "react-native";
import React from "react";
import styles from "@/utils/styles";

/**
 * The available text sizes.
 */
export type TextSize =
  | /** 8px */ "3xs"
  | /** 10px */ "2xs"
  | /** 12px */ "xs"
  | /** 14px */ "sm"
  | /** 16px */ "base"
  | /** 20px */ "lg"
  | /** 24px */ "xl";

interface TextContentProps {
  /**
   * The class name of the text.
   */
  className?: string;

  /**
   * The style of the text.
   */
  style?: object;

  /**
   * The text to display if complex.
   */
  children?: React.ReactNode;

  /**
   * The text to display.
   */
  text?: string;

  /**
   * The size of the text.
   * - `"3xs"` → `8px`
   * - `"2xs"` → `10px`
   * - `"xs"` → `12px`
   * - `"sm"` → `14px`
   * - `"base"` → `16px`
   * - `"lg"` → `20px`
   * - `"xl"` → `24px`
   */
  size?: TextSize;

  /**
   * The function to call when the text is pressed.
   */
  onPress?: () => void;

  /**
   * The number of lines to display.
   */
  numberOfLines?: number;
}

const TextContent = ({ className, children, style, text, onPress, size = "base", numberOfLines }: TextContentProps) => {
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
    case "sm":
      textStyle = [styles.textSm, styles.leadingSnug];
      break;
    case "base":
      textStyle = [styles.textBase, styles.leadingNormal];
      break;
    case "lg":
      textStyle = [styles.textLg, styles.leadingRelaxed];
      break;
    case "xl":
      textStyle = [styles.textXl, styles.leadingRelaxed];
      break;
  }

  return (
    <Text
      onPress={onPress}
      style={[style, [...textStyle]]}
      numberOfLines={numberOfLines}
      className={`h-fit font-inter ${className}`}
      suppressHighlighting
    >
      {children || text}
    </Text>
  );
};

export default TextContent;
