import { Text } from "react-native";
import React from "react";
import normalize from "../utils/normalize"; // Import the normalize function

interface HeadingContentProps {
  children?: React.ReactNode;
  size: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "h7";
  className?: string;
  heading?: string;
}

const HeadingContent = ({ children, size, className, heading: title }: HeadingContentProps) => {
  let textStyle = {};

  switch (size) {
    case "h1":
      textStyle = { fontSize: normalize(58), lineHeight: normalize(87), fontWeight: "900" };
      break;
    case "h2":
      textStyle = { fontSize: normalize(48), lineHeight: normalize(72), fontWeight: "900" };
      break;
    case "h3":
      textStyle = { fontSize: normalize(40), lineHeight: normalize(60), fontWeight: "900" };
      break;
    case "h4":
      textStyle = { fontSize: normalize(34), lineHeight: normalize(51), fontWeight: "900" };
      break;
    case "h5":
      textStyle = { fontSize: normalize(28), lineHeight: normalize(42), fontWeight: "900" };
      break;
    case "h6":
      textStyle = { fontSize: normalize(24), lineHeight: normalize(36), fontWeight: "900" };
      break;
    case "h7":
      textStyle = { fontSize: normalize(20), lineHeight: normalize(30), fontWeight: "900" };
      break;
  }

  return (
    <Text style={[textStyle]} className={`w-full font-inter ${className}`} adjustsFontSizeToFit>
      {children || title}
    </Text>
  );
};

export default HeadingContent;
