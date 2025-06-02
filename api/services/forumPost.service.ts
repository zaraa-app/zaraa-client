import { Databases, ID } from "react-native-appwrite";
import { client, config, tableIds } from "../appwrite";
import { ForumPostResponse } from "../types/forumPost.types";
import { FileRequest, uploadImage } from "./storage.service";
import { ImagePickerAsset } from "expo-image-picker";
import { UserResponse } from "../types/user.types";

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
    console.log("Error fetching forum posts:", error);
    return [];
  }
};

/**
 * Creates a new forum post in the database with associated images.
 *
 * @param {ForumPostResponse} forumPost - The forum post data to be created, including title, body, user, and tags.
 * @param {ImagePickerAsset[]} imageUris - An array of image assets to be uploaded and associated with the forum post.
 *
 * @returns {Promise<void>} - A promise that resolves when the forum post is successfully created, or throws an error if the creation fails.
 * @throws {Error} - If there is an issue uploading images or creating the forum post in the database.
 */
export const createForumPost = async (forumPost: ForumPostResponse, imageUris: ImagePickerAsset[]): Promise<void> => {
  try {
    const uploadedImages: string[] = [];

    for (const asset of imageUris) {
      const fileRequest: FileRequest = {
        uri: asset.uri,
        name: asset.fileName || `image-${Date.now()}.jpg`,
        type: asset.type ? `image/${asset.uri.split(".").pop()?.toLowerCase() || "jpeg"}` : "image/jpeg",
        size: asset.fileSize || 0,
      };

      const uploaded = await uploadImage(fileRequest);

      if (uploaded) {
        uploadedImages.push(uploaded.toString());
      }
    }

    const mappedImages = uploadedImages.map((url) => ({
      imageUrl: url,
    }));

    const request = {
      ...forumPost,
      images: mappedImages,
      tags: forumPost.tags.map((tag) => tag.$id),
      user: forumPost.user.$id,
    };

    await databases.createDocument(config.databaseId, tableIds.forumPosts, ID.unique(), request);
  } catch (error) {
    console.log("Error creating forum post:", error);
    throw error;
  }
};

/**
 * Fetches a single forum post by its ID from the Appwrite database.
 *
 * @param {string} forumId - The ID of the forum post to retrieve.
 * @returns {Promise<ForumPostResponse>} - The forum post data.
 * @throws {Error} - If the post is not found or the request fails.
 */
export const getForumPostById = async (forumId: string): Promise<ForumPostResponse> => {
  try {
    const response = await databases.getDocument(config.databaseId, tableIds.forumPosts, forumId);

    return response as ForumPostResponse;
  } catch (error) {
    console.error("Error fetching forum post by ID:", error);
    throw error;
  }
};

/**
 * Posts a reply to a specific forum post in the Appwrite database.
 * @param forum - The forum post to which the reply is being made.
 * @param comment - The content of the reply.
 * @param user - The user who is posting the reply.
 * @param replyingTo - An optional ID of the comment being replied to.
 * @returns {Promise<void>} - A promise that resolves when the reply is successfully posted.
 * @throws {Error} - If there is an error posting the reply.
 */
export const postReply = async (forum: ForumPostResponse, comment: string, user: UserResponse, replyingTo?: string): Promise<void> => {
  try {
    await databases.createDocument(config.databaseId, tableIds.forumComments, ID.unique(), {
      content: comment,
      user: user.$id,
      replyingTo: replyingTo,
      post: forum.$id,
    });
  } catch (error) {
    console.error("Error posting reply:", error);
    throw error;
  }
};
