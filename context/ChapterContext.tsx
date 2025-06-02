import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCategory } from "./CategoryContext";
import { getChapters } from "@/api/services/chapter.service";
import { ChapterResponse } from "@/api/types/chapter.types";

interface ChapterContextType {
  chapters: ChapterResponse[];
  selectedChapter: ChapterResponse | null;
  setSelectedChapter: (chapter: ChapterResponse) => void;
}

const ChapterContext = createContext<ChapterContextType | undefined>(undefined);

export const ChapterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedCategory } = useCategory();
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<ChapterResponse | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        if (!selectedCategory) return;

        const data: ChapterResponse[] | undefined = await getChapters(selectedCategory.$id);

        if (!data || data.length === 0) throw new Error("No chapters found for this category");

        const sortedChapters = data.sort((a, b) => a.index - b.index);
        setChapters(sortedChapters);

        const storedChapter = await AsyncStorage.getItem("selectedChapter");
        if (storedChapter) {
          const parsedChapter = JSON.parse(storedChapter);
          const foundChapter = sortedChapters.find((chapter) => chapter.$id === parsedChapter.$id);
          setSelectedChapter(foundChapter || sortedChapters[0]);
        } else {
          setSelectedChapter(sortedChapters[0]);
        }
      } catch (error) {
        console.log("Error fetching chapters:", error);
      }
    };

    fetchChapters();
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedChapter) {
      AsyncStorage.setItem("selectedChapter", JSON.stringify(selectedChapter));
    }
  }, [selectedChapter, selectedCategory]);

  return <ChapterContext.Provider value={{ chapters, selectedChapter, setSelectedChapter }}>{children}</ChapterContext.Provider>;
};

export const useChapter = () => {
  const context = useContext(ChapterContext);
  if (!context) throw new Error("useChapter must be used within a ChapterProvider");
  return context;
};
