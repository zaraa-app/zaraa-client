import { Databases } from "react-native-appwrite";
import { client, config, tableIds } from "../appwrite";
import { TagResponse } from "../types/tag.types";

const databases: Databases = new Databases(client);

export const getAllTags = async (): Promise<TagResponse[]> => {
  try {
    const response = await databases.listDocuments(config.databaseId, tableIds.tags);

    return response.documents as TagResponse[];
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
};
