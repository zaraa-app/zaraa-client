import React from "react";
import { Modal, View } from "react-native";
import TextContent from "@/components/TextContent";
import ActionButton from "@/components/ActionButton";

interface ExitQuizModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ExitQuizModal({ visible, onConfirm, onCancel }: ExitQuizModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full gap-4 rounded-2xl bg-white p-6">
          <TextContent text="Exit Quiz?" size="lg" className="text-center font-extrabold" />
          <TextContent
            text="Are you sure you want to leave? Your current progress in this lesson will be lost."
            className="text-center text-neutral-700"
          />
          <View className="flex-row justify-between gap-4">
            <ActionButton title="Cancel" onPress={onCancel} className="flex-1 bg-neutral-300" />
            <ActionButton title="Exit" onPress={onConfirm} className="flex-1 bg-red-500" />
          </View>
        </View>
      </View>
    </Modal>
  );
}
