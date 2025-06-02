import { View } from "react-native";
import React from "react";
import TextContent from "../TextContent";
import styles from "@/utils/styles";
import normalize from "@/utils/normalize";

export interface LessonDetailProps {
  label: string;
  children?: React.ReactNode;
}

const LessonDetail = ({ label, children }: LessonDetailProps) => {
  return (
    <View style={[styles.gap1]}>
      <TextContent size="2xs" text={label} className="text-white" />
      <View
        className="flex-row items-center justify-center rounded-full bg-secondary-100"
        style={[{ minWidth: normalize(96), minHeight: normalize(32) }]}
      >
        {children}
      </View>
    </View>
  );
};

export default LessonDetail;
