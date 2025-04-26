import React, { useEffect, useRef, useState } from "react";
import {
  View,
  SafeAreaView,
  FlatList,
  Modal,
  Dimensions,
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import normalize from "@/utils/normalize";
import FormField from "@/components/FormField";
import ActionButton from "@/components/ActionButton";
import TagLabel from "@/components/TagLabel";
import TextContent from "@/components/TextContent";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";

import { getAllTags } from "@/api/services/tag.service";
import { createForumPost } from "@/api/services/forumPost.service";
import { TagResponse } from "@/api/types/tag.types";
import { ForumPostResponse } from "@/api/types/forumPost.types";
import { useGlobalContext } from "@/context/GlobalProvider";

// Import Rich Editor & Toolbar
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";

// Props for visibility toggling (e.g., closing the modal/screen)
export interface CreateForumViewProps {
  toggleVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateForumView = ({ toggleVisibility }: CreateForumViewProps) => {
  const { user } = useGlobalContext();
  const screenWidth = Dimensions.get("window").width;

  // Editor reference
  const richText = useRef<RichEditor>(null);

  // Component states
  const [editorState, setEditorState] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagResponse[]>([]);
  const [selectedImages, setSelectedImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Ref for images FlatList in modal
  const flatListRef = useRef<FlatList>(null);

  // Fetch tags once the component mounts.
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

  // Tag selection handler
  const selectTag = (tag: TagResponse) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((existingTag) => existingTag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Image picker (max 5 images)
  const pickImages = async () => {
    if (selectedImages.length >= 5) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      selectionLimit: 5 - selectedImages.length,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImages([...selectedImages, ...result.assets]);
    }
  };

  // Handler for submitting a forum post
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
      console.error("Failed to create forum post:", error);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      {isLoading ?
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={{ marginTop: 16, fontSize: 16, color: "#4B5563" }}>Posting your forum...</Text>
        </View>
      : <TouchableWithoutFeedback
          onPress={() => {
            richText.current?.blurContentEditor();
          }}
          accessible={false}
        >
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View
              style={{
                paddingHorizontal: 24,
                paddingVertical: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Ionicons name="close" size={normalize(24)} onPress={() => toggleVisibility(false)} />
              <ActionButton title="Post" onPress={onForumPost} textSize={{ fontSize: normalize(16) }} fullWidth={false} />
            </View>

            {/* Title and Image Picker */}
            <View style={{ paddingHorizontal: 24, flexDirection: "row", alignItems: "flex-end", gap: 8 }}>
              <View style={{ flex: 1 }}>
                <FormField label="Title" placeholder="Enter a title" autoCapitalize="words" value={title} onValueChange={setTitle} />
              </View>
              <Pressable
                onPress={pickImages}
                style={{
                  position: "relative",
                  aspectRatio: 1,
                  height: 48,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12,
                  backgroundColor: "#f3f4f6",
                }}
              >
                <Ionicons name="image" size={normalize(24)} color="#4B5563" />
                {selectedImages.length > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      right: -6,
                      top: -6,
                      height: 24,
                      width: 24,
                      borderRadius: 12,
                      backgroundColor: "#3b82f6",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: "bold", color: "#fff" }}>{selectedImages.length}</Text>
                  </View>
                )}
              </Pressable>
            </View>

            {/* Tags */}
            <View style={{ paddingHorizontal: 24, marginTop: 8, gap: 8 }}>
              <TextContent size="sm" text="Related Tags" />
              <FlatList
                contentContainerStyle={{ gap: 8 }}
                data={tags}
                renderItem={({ item }) => (
                  <TagLabel
                    size="xs"
                    color={selectedTags.includes(item) ? "primary" : "secondary"}
                    label={item.name}
                    onPress={() => selectTag(item)}
                  />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>

            {/* Rich Editor with Pinned Toolbar */}
            <View style={{ flex: 1, marginVertical: 16, paddingHorizontal: 24, borderRadius: 16 }}>
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={80} // adjust as needed
              >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      borderRadius: 16,
                      backgroundColor: "#fff",
                    }}
                  >
                    <RichToolbar
                      getEditor={() => richText.current}
                      actions={[
                        actions.keyboard,
                        actions.setBold,
                        actions.setItalic,
                        actions.setUnderline,
                        actions.setStrikethrough,
                        actions.heading1,
                        actions.heading2,
                        actions.heading3,
                        actions.indent,
                        actions.outdent,
                        actions.insertBulletsList,
                        actions.insertOrderedList,
                        actions.insertLink,
                      ]}
                      iconMap={{
                        [actions.heading1]: ({ tintColor }: { tintColor: string }) => (
                          <Text style={{ color: tintColor, fontSize: 16 }}>H1</Text>
                        ),
                        [actions.heading2]: ({ tintColor }: { tintColor: string }) => (
                          <Text style={{ color: tintColor, fontSize: 16 }}>H2</Text>
                        ),
                        [actions.heading3]: ({ tintColor }: { tintColor: string }) => (
                          <Text style={{ color: tintColor, fontSize: 16 }}>H3</Text>
                        ),
                        [actions.insertImage]: ({ tintColor }: { tintColor: string }) => (
                          <Ionicons name="image-outline" size={24} color={tintColor} />
                        ),
                      }}
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#ccc",
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        backgroundColor: "#fff",
                      }}
                    />
                    <View style={{ flex: 1 }}>
                      <RichEditor
                        ref={richText}
                        placeholder="Write your post here..."
                        initialHeight={200}
                        onChange={(html) => setEditorState(html)}
                        style={{ flex: 1, borderRadius: 16 }}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </View>

            {/* Selected Images Preview */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 24 }}>
              {selectedImages.map((image, index) => (
                <View key={index} style={{ position: "relative" }}>
                  <Pressable
                    onPress={() => {
                      setCurrentImageIndex(index);
                      setPreviewVisible(true);
                    }}
                  >
                    <Image source={{ uri: image.uri }} style={{ width: 60, height: 60, borderRadius: 12 }} />
                  </Pressable>
                  <Pressable
                    onPress={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                    style={{
                      position: "absolute",
                      right: -6,
                      top: -6,
                      zIndex: 10,
                      height: 20,
                      width: 20,
                      borderRadius: 10,
                      backgroundColor: "black",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 10, color: "#fff" }}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>

            {/* Image Preview Modal */}
            {previewVisible && (
              <Modal visible={previewVisible} animationType="fade">
                <View style={{ flex: 1, backgroundColor: "#000" }}>
                  <FlatList
                    ref={flatListRef}
                    horizontal
                    pagingEnabled
                    data={selectedImages}
                    keyExtractor={(_, i) => `${i}`}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          width: screenWidth,
                          height: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image source={{ uri: item.uri }} style={{ width: "100%", height: "100%", resizeMode: "contain" }} />
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
                    style={{
                      position: "absolute",
                      right: 24,
                      top: 48,
                      zIndex: 50,
                      height: 40,
                      width: 40,
                      borderRadius: 20,
                      backgroundColor: "rgba(0,0,0,0.7)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="close" size={normalize(24)} color="#fff" />
                  </Pressable>
                </View>
              </Modal>
            )}
          </View>
        </TouchableWithoutFeedback>
      }
      <Toast />
    </SafeAreaView>
  );
};

export default CreateForumView;
