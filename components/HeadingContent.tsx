import { Text } from "react-native";
import React from "react";

interface HeadingContentProps {
  children: React.ReactNode;
  size: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "h7";
  className?: string;
}

const HeadingContent = ({ children, size, className }: HeadingContentProps) => {
  let headingClasses = "font-inter w-full";

  switch (size) {
    case "h1":
      headingClasses += " text-7xl font-black leading-[87px]";
      break;
    case "h2":
      headingClasses += " text-6xl font-black leading-[72px]";
      break;
    case "h3":
      headingClasses += " text-5xl font-black leading-[60px]";
      break;
    case "h4":
      headingClasses += " text-4xl font-black leading-[51px]";
      break;
    case "h5":
      headingClasses += " text-3xl font-black leading-[42px]";
      break;
    case "h6":
      headingClasses += " text-2xl font-black leading-[36px]";
      break;
    case "h7":
      headingClasses += " text-xl font-black leading-[30px]";
      break;
  }

  return <Text className={`${headingClasses} ${className}`}>{children}</Text>;
};

export default HeadingContent;
