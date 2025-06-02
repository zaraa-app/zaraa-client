import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlantCategory } from "@/api/types/plantCategory.types";

interface PlantCategorySelection extends PlantCategory {
  icon: any;
}

interface CategoryContextType {
  selectedCategory: PlantCategorySelection | null;
  setSelectedCategory: (category: PlantCategorySelection) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<PlantCategorySelection | null>(null);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const storedCategory = await AsyncStorage.getItem("selectedCategory");
        if (storedCategory) {
          setSelectedCategory(JSON.parse(storedCategory));
        }
      } catch (error) {
        console.log("Error loading category:", error);
      }
    };

    loadCategory();
  }, []);

  useEffect(() => {
    const saveCategory = async () => {
      try {
        if (selectedCategory) {
          await AsyncStorage.setItem("selectedCategory", JSON.stringify(selectedCategory));
        }
      } catch (error) {
        console.log("Error saving category:", error);
      }
    };

    saveCategory();
  }, [selectedCategory]);

  return <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>{children}</CategoryContext.Provider>;
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error("useCategory must be used within a CategoryProvider");
  return context;
};
