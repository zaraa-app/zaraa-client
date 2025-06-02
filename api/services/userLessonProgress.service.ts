import { Databases, ID, Query } from "react-native-appwrite";
import { client, config, tableIds } from "../appwrite";
import { ELessonStatus, UserLessonProgressResponse } from "../types/userLessonProgress.types";

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

/**
 * Updates the user's lesson progress by marking a lesson as completed.
 * @param {string} userId - The ID of the user whose lesson progress is to be updated.
 * @param {string} lessonId - The ID of the lesson to be marked as completed.
 * @returns {Promise<UserLessonProgressResponse | null>} - A promise that resolves to the UserLessonProgressResponse object if successful, otherwise null.
 * @throws {Error} - If there is an error updating the user's lesson progress.
 */
export const updateUserLessonProgress = async (userId: string, lessonId: string): Promise<UserLessonProgressResponse | null> => {
  try {
    const userLessonProgress = await databases.createDocument(config.databaseId, tableIds.userLessonProgress, ID.unique(), {
      user: userId,
      lesson: lessonId,
      dateCompleted: new Date().toISOString(),
      status: ELessonStatus.Completed,
    });

    return userLessonProgress as UserLessonProgressResponse;
  } catch (error: any) {
    console.log("Error updating user lesson progress:", error);
    return null;
  }
};
