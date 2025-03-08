import { View, TouchableOpacity, FlatList, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import TextContent from "./TextContent";
import styles from "@/utils/styles";
import { Ionicons } from "@expo/vector-icons";
import normalize from "@/utils/normalize";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlantCategory } from "@/api/types/plantCategory.types";
import { getCategories, getCategoryIcon } from "@/api/services/plantCategory.service";
import { useCategory } from "@/context/CategoryContext";
import { selectionAsync } from "expo-haptics";

const SCREEN_WIDTH = Dimensions.get("window").width;
const NUMBER_OF_ITEMS = 2.3;
const ITEM_SIZE = (SCREEN_WIDTH - normalize(48)) / NUMBER_OF_ITEMS;
const ANIMATION_DURATION = 300;

export interface PlantCategorySelection extends PlantCategory {
  icon: any;
}

const CategorySelect = () => {
  const { selectedCategory, setSelectedCategory } = useCategory();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [categories, setCategories] = useState<PlantCategorySelection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const dropdownHeight = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const storedCategory = await AsyncStorage.getItem("selectedCategory");

        const data = await getCategories();
        if (!data || data.length === 0) throw new Error("Failed to fetch categories");

        const mappedCategories: PlantCategorySelection[] = data.map((category) => ({
          ...category,
          icon: getCategoryIcon(category),
        }));

        setCategories(mappedCategories);

        if (storedCategory) {
          const parsedCategory = JSON.parse(storedCategory);
          const validStoredCategory = mappedCategories.find((category) => category.$id === parsedCategory.$id);

          if (validStoredCategory) {
            setSelectedCategory(validStoredCategory);
            return;
          }
        }

        setSelectedCategory(mappedCategories[0]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /**
   * Handles the press event to toggle the dropdown visibility.
   */
  const handlePress = () => {
    selectionAsync();
    setIsVisible(!isVisible);
    rotation.value = withTiming(isVisible ? 0 : 180, { duration: ANIMATION_DURATION });
    dropdownHeight.value = withTiming(isVisible ? 0 : ITEM_SIZE * 2 + normalize(48), { duration: ANIMATION_DURATION });
  };

  /**
   * Handles the selection of a category.
   * @param category - The category to select
   */
  const handleCategorySelect = async (category: PlantCategorySelection) => {
    selectionAsync();
    setSelectedCategory(category);
    setIsVisible(false);
    rotation.value = withTiming(isVisible ? 0 : 180, { duration: ANIMATION_DURATION });
    dropdownHeight.value = withTiming(0, { duration: ANIMATION_DURATION });

    try {
      await AsyncStorage.setItem("selectedCategory", JSON.stringify(category));
    } catch (error) {
      console.error("Failed to save category", error);
    }
  };

  const animatedDropdownStyle = useAnimatedStyle(() => ({
    height: dropdownHeight.value,
    opacity: dropdownHeight.value > 0 ? 1 : 0,
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="relative">
      {isLoading ? null : (
        <>
          <TouchableOpacity
            activeOpacity={0.9}
            className="min-h-[48px] flex-row items-center justify-between rounded-full bg-neutral-1000"
            style={[styles.px4, styles.py3, styles.gap2]}
            onPress={handlePress}
          >
            <View className="flex-row items-center" style={[styles.gap2]}>
              {selectedCategory?.icon && React.createElement(selectedCategory?.icon, { width: normalize(16), height: normalize(16) })}
              <TextContent text={selectedCategory?.name} size="base" className="font-bold text-white" />
            </View>
            <Animated.View style={animatedIconStyle}>
              <Ionicons name="chevron-down" color="white" size={normalize(18)} />
            </Animated.View>
          </TouchableOpacity>

          <Animated.View
            style={[animatedDropdownStyle, { width: SCREEN_WIDTH - normalize(48), left: 0, position: "absolute", top: "100%" }]}
            className="mt-2 rounded-3xl bg-neutral-1000 py-2"
          >
            <FlatList
              data={categories}
              keyExtractor={(item) => item.name}
              numColumns={Math.floor(NUMBER_OF_ITEMS)}
              contentContainerStyle={{ alignItems: "center", paddingVertical: 8 }}
              renderItem={({ item }) => {
                const isSelected = selectedCategory?.$id === item.$id;
                const IconComponent = item.icon;

                return (
                  <TouchableOpacity
                    onPress={() => handleCategorySelect(item)}
                    className="m-2 items-center justify-center"
                    style={{
                      width: ITEM_SIZE,
                      height: ITEM_SIZE,
                      gap: 8,
                      aspectRatio: 1,
                      borderRadius: 16,
                      padding: 8,
                      backgroundColor: isSelected ? "rgba(109, 190, 69, 0.1)" : "rgba(255, 255, 255, 0.05)",
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: "rgba(109, 190, 69, 1)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconComponent width={40} height={40} />
                    <TextContent
                      text={item.name}
                      size="base"
                      numberOfLines={1}
                      style={{ fontWeight: isSelected ? "bold" : null }}
                      className="mt-1 text-center text-white"
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </Animated.View>
        </>
      )}
    </View>
  );
};

export default CategorySelect;
