import { Databases } from "react-native-appwrite";
import { client, config, tableIds } from "../appwrite";
import { ForumPostResponse } from "../types/forumPost.types";

const databases: Databases = new Databases(client);

/**
 * Retrieves a list of all forum posts from the database.
 * @returns {Promise<ForumPostResponse[]>} - A promise that resolves to an array of ForumPostResponse objects if successful, otherwise an empty array.
 * @throws {Error} - If there is an error fetching the forum posts from the database.
 */
export const getAllForumPosts = async (): Promise<ForumPostResponse[]> => {
  try {
    const response = await databases.listDocuments(config.databaseId, tableIds.forumPosts);
    return response.documents as ForumPostResponse[];
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    return [];
  }
};
