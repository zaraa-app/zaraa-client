import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import styles from "@/utils/styles";
import { cva } from "class-variance-authority";

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  leftIcon?: React.JSX.Element;
  rightIcon?: React.JSX.Element;
  disabled?: boolean;
  intent?: "primary" | "secondary" | "tertiary";
  fullWidth?: boolean;
  isOutline?: boolean;
  className?: string;
  style?: object;
  textSize?: object;
}

const ActionButton = ({
  title,
  onPress,
  disabled = false,
  intent = "primary",
  isOutline = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  className,
  style,
  textSize = styles.textBase,
}: ActionButtonProps) => {
  const buttonClasses = cva("rounded-full items-center", {
    variants: {
      intent: {
        primary: "bg-primary-300",
        secondary: "bg-secondary-300",
        tertiary: "bg-white",
      },
      isOutline: {
        true: "bg-transparent border border-primary-300",
        false: "",
      },
      disabled: {
        true: "!bg-neutral-400",
      },
      fullWidth: {
        true: "w-full",
      },
    },
  });

  const textClasses = cva("font-inter font-bold", {
    variants: {
      isOutline: {
        true: "",
      },
      intent: {
        primary: "text-white",
        secondary: "text-white",
        tertiary: "text-neutral-900",
      },
      disabled: {
        true: "text-neutral-200",
      },
    },
    compoundVariants: [
      {
        isOutline: true,
        intent: "primary",
        class: "!text-primary-300",
      },
      {
        isOutline: true,
        intent: "secondary",
        class: "!text-secondary-300",
      },
    ],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`${buttonClasses({ intent, isOutline, disabled, fullWidth })} ${className}`}
      style={[style, styles.p4]}
      activeOpacity={0.9}
    >
      <View className="flex-row items-center" style={[styles.gap2]}>
        {leftIcon}
        <Text className={textClasses({ intent, isOutline, disabled })} style={textSize}>
          {title}
        </Text>
        {rightIcon}
      </View>
    </TouchableOpacity>
  );
};

export default ActionButton;
