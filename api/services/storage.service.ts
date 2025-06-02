import { client, config } from "../appwrite";
import { ID, Storage } from "react-native-appwrite";

export interface FileRequest {
  name: string;
  type: string;
  size: number;
  uri: string;
}

const storage = new Storage(client);

export const uploadImage = async (file: FileRequest): Promise<URL | null> => {
  try {
    const response = await storage.createFile(config.storageId, ID.unique(), file);
    const imageLink = await storage.getFilePreview(config.storageId, response.$id);
    return imageLink;
  } catch (error) {
    console.error(error);
    return null;
  }
};
