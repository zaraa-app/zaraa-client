import React from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";

interface CommentInputProps {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isReplyingTo?: string;
  isSubmitting?: boolean;
}

const CommentInput: React.FC<CommentInputProps> = ({ value, onChange, onSubmit, onCancel, isReplyingTo, isSubmitting }) => (
  <View className="mt-2 flex-row items-center border-b border-gray-200 pb-[4px]">
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="Write your comment..."
      className="flex-1 py-1 pr-2 text-sm text-gray-800"
      multiline
    />
    <Pressable onPress={onSubmit} className="px-1">
      {isSubmitting ?
        <ActivityIndicator size="small" />
      : <Text className="text-sm font-medium text-blue-500">Post</Text>}
    </Pressable>
    {onCancel && (
      <Pressable onPress={onCancel} className="ml-2 px-1">
        <Text className="text-sm text-gray-500">Cancel</Text>
      </Pressable>
    )}
  </View>
);

export default CommentInput;
