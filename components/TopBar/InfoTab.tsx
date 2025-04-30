import { View } from "react-native";
import React from "react";
import styles from "@/utils/styles";
import TextContent from "../TextContent";

export interface InfoTabProps {
  content?: string;
  icon?: React.ReactNode;
  color?: "white" | "black";
}

const InfoTab = ({ content, icon, color }: InfoTabProps) => {
  return (
    <View
      className={`min-h-[32px] min-w-[32px] flex-row items-center justify-center rounded-full ${
        color === "white" ? "bg-white" : "bg-black"
      }`}
      style={[styles.p4, styles.gap1]}
    >
      {icon}
      {content && <TextContent text={content} className={`font-bold ${color === "white" ? "text-black" : "text-white"}`} />}
    </View>
  );
};

export default InfoTab;
