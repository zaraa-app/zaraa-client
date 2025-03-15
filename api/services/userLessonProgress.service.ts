import { Databases, Query } from "react-native-appwrite";
import { client, config, tableIds } from "../appwrite";
import { UserLessonProgressResponse } from "../types/userLessonProgress.types";

const databases: Databases = new Databases(client);

/**
 * Retrieves a user's lesson progress from the database.
 * @param {string} userId - The id of the user.
 * @returns {Promise<UserLessonProgressResponse[] | null>} - A promise that resolves to an array of UserLessonProgressResponse objects if successful, otherwise null.
 * @throws {Error} - If there is an error getting the user's lesson progress.
 */
export const getUserLessonProgress = async (userId: string): Promise<UserLessonProgressResponse[]> => {
  try {
    const userLessonProgress = await databases.listDocuments(config.databaseId, tableIds.userLessonProgress, [Query.equal("user", userId)]);

    if (!userLessonProgress || !userLessonProgress.documents) {
      return [];
    }

    return userLessonProgress.documents as UserLessonProgressResponse[];
  } catch (error: any) {
    console.log("Error getting user lesson progress:", error);
    return [];
  }
};
