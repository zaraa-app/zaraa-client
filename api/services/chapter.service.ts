import { Databases, Query } from "react-native-appwrite";
import { client, config, tableIds } from "../appwrite";
import { ChapterResponse } from "../types/chapter.types";

const databases: Databases = new Databases(client);

/**
 * Retrieves a list of chapters from the database.
 * @returns {Promise<ChapterResponse[] | undefined>} - A promise that resolves to an array of ChapterResponse objects if successful, otherwise undefined.
 * @throws {Error} - If there is an error fetching the chapters from the database.
 */
export const getChapters = async (selectedCategoryId: string): Promise<ChapterResponse[] | undefined> => {
  try {
    const chapters = await databases.listDocuments(config.databaseId, tableIds.chapters, [
      Query.equal("category", selectedCategoryId),
    ]);
    return chapters.documents as ChapterResponse[];
  } catch (error: any) {
    console.log("Error getting chapters:", error);
    return [];
  }
};
