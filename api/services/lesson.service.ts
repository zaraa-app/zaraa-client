import { Databases, Query } from "react-native-appwrite";
import { getChapters } from "./chapter.service";
import { client, config, tableIds } from "../appwrite";
import { LessonResponse } from "../types/lesson.types";

const databases: Databases = new Databases(client);

/**
 * Retrieves all lessons associated with a given category.
 * @param categoryId The id of the category
 * @returns A promise that resolves to an array of LessonResponse objects
 * @throws {Error} - If there is an error fetching the lessons from the database.
 */
export const getLessonsByCategory = async (categoryId: string): Promise<LessonResponse[]> => {
  try {
    const allChapters = await getChapters(categoryId);

    if (!allChapters) {
      return [];
    }

    const allLessons = await Promise.all(allChapters.map((chapter) => getLessonsByChapter(chapter.$id)));

    return allLessons.flat() as LessonResponse[];
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return [];
  }
};

/**
 * Retrieves all lessons in a given chapter.
 * @param chapterId The id of the chapter
 * @returns A promise that resolves to an array of LessonResponse objects
 * @throws {Error} - If there is an error fetching the lessons from the database.
 */
export const getLessonsByChapter = async (chapterId: string): Promise<LessonResponse[]> => {
  try {
    const lessons = await databases.listDocuments(config.databaseId, tableIds.lessons, [Query.equal("chapterId", chapterId)]);

    if (!lessons || !lessons.documents) {
      return [];
    }

    return lessons.documents as LessonResponse[];
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return [];
  }
};
