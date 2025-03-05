import { View } from "react-native";
import React from "react";
import styles from "@/utils/styles";
import TextContent from "../TextContent";

export interface InfoTabProps {
  content: string;
  icon?: React.ReactNode;
}

const InfoTab = ({ content, icon }: InfoTabProps) => {
  return (
    <View className="flex-row items-center justify-center rounded-full bg-neutral-1000" style={[styles.px4, styles.py3, styles.gap1]}>
      {icon}
      <TextContent text={content} className="font-bold text-white" />
    </View>
  );
};

export default InfoTab;
