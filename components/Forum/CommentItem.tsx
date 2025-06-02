import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { ForumCommentsResponse } from "@/api/types/forumPost.types";

interface CommentItemProps {
  comment: ForumCommentsResponse;
  onReply: (comment: ForumCommentsResponse) => void;
  replyingTo: ForumCommentsResponse | null;
  renderReplyInput: () => React.ReactNode;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, replyingTo, renderReplyInput }) => (
  <View className="ml-2 mt-3">
    <View className="flex-row items-start gap-2">
      <Image source={{ uri: comment.user?.avatar?.toString().replace("/preview", "/view") }} className="mt-[2px] h-6 w-6 rounded-full" />
      <View className="flex-1">
        <Text className="text-sm font-semibold text-gray-900">{comment.user?.name}</Text>
        <Text className="mt-[2px] text-sm text-gray-700">{comment.content}</Text>
        <Pressable onPress={() => onReply(comment)}>
          <Text className="mt-[2px] text-xs text-blue-500">Reply</Text>
        </Pressable>

        {replyingTo?.$id === comment.$id && <View className="mt-1">{renderReplyInput()}</View>}

        {comment.replies?.map((reply) => (
          <View key={reply.$id} className="mt-2 border-l border-gray-100 pl-1">
            <CommentItem comment={reply} onReply={onReply} replyingTo={replyingTo} renderReplyInput={renderReplyInput} />
          </View>
        ))}
      </View>
    </View>
  </View>
);

export default CommentItem;
