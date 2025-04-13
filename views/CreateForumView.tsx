import { View, SafeAreaView, FlatList, Modal, Dimensions, ActivityIndicator } from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import * as ImagePicker from "expo-image-picker";
import { Image, Pressable, Text } from "react-native";
import { createForumPost } from "@/api/services/forumPost.service";
import { ForumPostResponse } from "@/api/types/forumPost.types";
import { useGlobalContext } from "@/context/GlobalProvider";
import Toast from "react-native-toast-message";

export interface CreateForumViewProps {
  toggleVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateForumView = ({ toggleVisibility }: CreateForumViewProps) => {
  const { user } = useGlobalContext();

  const [editorState, setEditorState] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagResponse[]>([]);
  const [selectedImages, setSelectedImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const screenWidth = Dimensions.get("window").width;
  const flatListRef = useRef<FlatList>(null);

  const selectTag = (tag: TagResponse) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((existingTag) => existingTag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const pickImages = async () => {
    if (selectedImages.length >= 5) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      selectionLimit: 5 - selectedImages.length,
      quality: 1,
    });

    if (!result.canceled) {
      const assets = result.assets;

      setSelectedImages([...selectedImages, ...assets]);
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

  async function onForumPost() {
    if (!user) return;

    if (!title.trim() || !editorState?.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing fields",
        text2: "Please enter both a title and body.",
        position: "bottom",
      });
      return;
    }

    setIsLoading(true);

    const forumPost: ForumPostResponse = {
      body: editorState || "",
      title: title,
      tags: selectedTags,
      user: user,
    } as ForumPostResponse;

    try {
      await createForumPost(forumPost, selectedImages);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Your post was created!",
        position: "bottom",
      });
      setTitle("");
      setEditorState(null);
      setSelectedTags([]);
      setSelectedImages([]);
      toggleVisibility(false);
    } catch (error) {
      console.log("Failed to create forum post:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create post. Try again.",
        position: "bottom",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1" style={[styles.gap4]}>
        {isLoading ?
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#10B981" />
            <Text className="mt-4 text-base font-medium text-gray-700">Posting your forum...</Text>
          </View>
        : <>
            <View style={[styles.px6, styles.gap4]}>
              <View className="flex-row items-center justify-between">
                <Ionicons name="close" size={normalize(24)} onPress={() => toggleVisibility(false)} suppressHighlighting />
                <ActionButton title="Post" onPress={onForumPost} textSize={styles.textXs} fullWidth={false} />
              </View>
              <View className="flex-row items-end gap-2">
                <View className="flex-1">
                  <FormField label="Title" placeholder="Enter a title" autoCapitalize="words" value={title} onValueChange={setTitle} />
                </View>

                <Pressable onPress={pickImages} className="relative aspect-square h-12 items-center justify-center rounded-xl bg-gray-100">
                  <Ionicons name="image" size={normalize(24)} color="#4B5563" />

                  {selectedImages.length > 0 && (
                    <View className="absolute -right-1.5 -top-1.5 h-6 w-6 items-center justify-center rounded-full bg-primary-300">
                      <Text className="text-xs font-bold text-white">{selectedImages.length}</Text>
                    </View>
                  )}
                </Pressable>
              </View>
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
            <View className="flex-row flex-wrap gap-2 px-6">
              {selectedImages.map((image, index) => (
                <View key={index} className="relative">
                  <Pressable
                    onPress={() => {
                      setCurrentImageIndex(index);
                      setPreviewVisible(true);
                    }}
                  >
                    <Image
                      source={{ uri: typeof image === "string" ? image : image.uri }}
                      style={{ width: 60, height: 60, borderRadius: 12 }}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setSelectedImages(selectedImages.filter((_, i) => i !== index));
                    }}
                    className="absolute -right-2 -top-2 z-10 h-5 w-5 items-center justify-center rounded-full bg-black"
                  >
                    <Text className="text-[10px] text-white">×</Text>
                  </Pressable>
                </View>
              ))}
            </View>
            {previewVisible && (
              <Modal visible={previewVisible} animationType="fade">
                <View className="flex-1 bg-black">
                  <FlatList
                    ref={flatListRef}
                    horizontal
                    pagingEnabled
                    data={selectedImages}
                    keyExtractor={(uri, i) => `${uri}-${i}`}
                    renderItem={({ item }) => (
                      <View style={{ width: screenWidth, height: "100%", justifyContent: "center", alignItems: "center" }}>
                        <Image source={{ uri: item }} style={{ width: "100%", height: "100%", resizeMode: "contain" }} />
                      </View>
                    )}
                    getItemLayout={(_, index) => ({
                      length: screenWidth,
                      offset: screenWidth * index,
                      index,
                    })}
                    initialScrollIndex={currentImageIndex}
                  />
                  <Pressable
                    onPress={() => setPreviewVisible(false)}
                    className="absolute right-6 top-12 z-50 h-10 w-10 items-center justify-center rounded-full bg-black/70"
                  >
                    <Ionicons name="close" size={normalize(24)} color="#fff" />
                  </Pressable>
                </View>
              </Modal>
            )}
          </>
        }
      </View>
      {previewVisible || isLoading || true ?
        <Toast />
      : null}
    </SafeAreaView>
  );
};

export default CreateForumView;
