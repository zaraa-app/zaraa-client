import { View, SafeAreaView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import TextEditor from "@/components/Forum/TextEditor/TextEditor";
import FormField from "@/components/FormField";
import styles from "@/utils/styles";
import { Ionicons } from "@expo/vector-icons";
import normalize from "@/utils/normalize";
import ActionButton from "@/components/ActionButton";
import TagLabel from "@/components/TagLabel";
import { TagResponse } from "@/api/types/tag.types";
import { getAllTags } from "@/api/services/tag.service";
import TextContent from "@/components/TextContent";

export interface CreateForumViewProps {
  toggleVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateForumView = ({ toggleVisibility }: CreateForumViewProps) => {
  const [editorState, setEditorState] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagResponse[]>([]);

  const selectTag = (tag: TagResponse) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((existingTag) => existingTag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await getAllTags();
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1" style={[styles.gap4]}>
        <View style={[styles.px6, styles.gap4]}>
          <View className="flex-row items-center justify-between">
            <Ionicons name="close" size={normalize(24)} onPress={() => toggleVisibility(false)} suppressHighlighting />
            <ActionButton title="Post" onPress={() => {}} textSize={styles.textXs} fullWidth={false} />
          </View>
          <FormField label="Title" placeholder="Enter a title" autoCapitalize="words" value={title} onValueChange={setTitle} />
        </View>
        <View style={[styles.px6, styles.gap2]}>
          <TextContent size="sm" text="Related Tags" />
          <FlatList
            contentContainerStyle={[styles.gap1]}
            data={tags}
            renderItem={({ item }) => (
              <TagLabel
                size="xs"
                color={selectedTags.includes(item) ? "primary" : "secondary"}
                label={item.name}
                onPress={() => selectTag(item)}
              />
            )}
            showsHorizontalScrollIndicator={false}
            horizontal
          />
        </View>
        <TextEditor setEditorState={setEditorState} />
      </View>
    </SafeAreaView>
  );
};

export default CreateForumView;
