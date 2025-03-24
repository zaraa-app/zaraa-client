import { AccountDetails } from "@/app/(auth)/sign-up";
import { client, tableIds, config } from "../appwrite";
import { Account, Avatars, Databases, ID } from "react-native-appwrite";
import { UserResponse } from "../types/user.types";
import { Language } from "../enums/ELanguage.enum";

const databases: Databases = new Databases(client);
const account: Account = new Account(client);
const avatars: Avatars = new Avatars(client);

/**
 * Creates a new user account.
 * @param {AccountDetails} options - The email, name, and password of the user.
 * @returns {Promise<UserResponse>} - The newly created user account data.
 * @throws {Error} - If there was an issue creating the user account.
 */
export const createUser = async ({ email, name, password }: AccountDetails) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount || !newAccount.$id) {
      throw new Error("Account creation failed or returned invalid data");
    }

    const avatarUrl = avatars.getInitials(name);

    const session = await signUserIn({ email, password });

    if (!session) {
      throw new Error("Sign-in failed after account creation");
    }

    const request: UserResponse = <UserResponse>{
      name: name ?? "No Name",
      email,
      avatar: avatarUrl,
      hearts: 5,
      streak: 0,
      xp: 0,
    };

    let newUser = await databases.createDocument(config.databaseId, tableIds.users, newAccount.$id, request);

    return newUser;
  } catch (error: any) {
    console.log("Error creating user:", error);
    throw new Error(error.message);
  }
};

/**
 * Signs the user in with an email and password.
 * @param {AccountDetails} options - The email and password of the user.
 * @throws {Error} - If the user was not signed in successfully.
 */
export const signUserIn = async ({ email, password }: AccountDetails) => {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error: any) {
    console.log("Sign-in failed:", error);
    return null;
  }
};

/**
 * Retrieves the current user's account information.
 * @returns {Promise<UserResponse | null>} - The current user's data if successful, otherwise null.
 * @throws {Error} - If there is no current account or user found.
 */

export const getCurrentUser = async (): Promise<UserResponse | null> => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw new Error("No current account found");

    const currentUser = await databases.getDocument(config.databaseId, tableIds.users, currentAccount.$id);

    if (!currentUser) throw new Error("No current user found");

    return currentUser as UserResponse;
  } catch (error: any) {
    console.log("Error getting current user:", error);
    return null;
  }
};

/**
 * Logs the user out by deleting their current sessions.
 * @throws {Error} - If the logout process fails.
 */
export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error: any) {
    console.log("Error logging out:", error);
  }
};

/**
 * Increments the streak count for a user.
 * @param {string} userId - The ID of the user whose streak is to be incremented.
 * @returns {Promise<any>} - A promise that resolves to the updated user document if successful.
 * @throws {Error} - If the user is not found or if there is an error incrementing the streak.
 */
export const incrementStreak = async (userId: string): Promise<UserResponse | undefined> => {
  try {
    const user = await databases.getDocument(config.databaseId, tableIds.users, userId);

    if (!user) {
      throw new Error("User not found");
    }

    const request: UserResponse = <UserResponse>{
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      hearts: user.hearts,
      streak: user.streak + 1,
      xp: user.xp,
    };

    const updatedUser = await databases.updateDocument(config.databaseId, tableIds.users, userId, request);

    return updatedUser as UserResponse;
  } catch (error: any) {
    console.log("Error incrementing streak:", error);
  }
};

/**
 * Resets a user's streak to 0.
 * @param {string} userId - The ID of the user whose streak is to be reset.
 * @returns {Promise<UserResponse | undefined>} - A promise that resolves to the updated user document if successful.
 * @throws {Error} - If the user is not found or if there is an error resetting the streak.
 */
export const resetStreak = async (userId: string): Promise<UserResponse | undefined> => {
  try {
    const user = await databases.getDocument(config.databaseId, tableIds.users, userId);

    if (!user) {
      throw new Error("User not found");
    }

    const request: UserResponse = <UserResponse>{
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      hearts: user.hearts,
      streak: 0,
      xp: user.xp,
    };

    const updatedUser = await databases.updateDocument(config.databaseId, tableIds.users, userId, request);

    return updatedUser as UserResponse;
  } catch (error: any) {
    console.log("Error incrementing streak:", error);
  }
};

/**
 * Fetches and returns the top 20 users sorted by XP.
 * @returns {Promise<UserResponse[]>} - An array of top 20 users.
 */
export const getAllUsers = async (): Promise<UserResponse[]> => {
  try {
    const response = await databases.listDocuments(config.databaseId, tableIds.users);

    if (!response.documents.length) return [];

    // Sort users by XP in descending order and return the top 20
    return response.documents.sort((a, b) => b.xp - a.xp).slice(0, 20) as UserResponse[];
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const updateUser = async (existingUser: UserResponse, newUser: UserResponse): Promise<UserResponse | null> => {
  try {
    if (!existingUser.$id) throw new Error("User ID is required");

    const updatedUserPayload: UserResponse = <UserResponse>{
      name: newUser.name || existingUser.name,
      avatar: newUser.avatar || existingUser.avatar,
      email: newUser.email || existingUser.email,
      phoneNumber: newUser.phoneNumber ? newUser.phoneNumber.toString() : existingUser.phoneNumber,
      dateOfBirth: newUser.dateOfBirth || existingUser.dateOfBirth,
      language: newUser.language || existingUser.language,
      xp: existingUser.xp,
      hearts: existingUser.hearts,
      streak: existingUser.streak,
      preferences: existingUser.preferences,
    };

    const updatedUser = await databases.updateDocument(config.databaseId, tableIds.users, existingUser.$id, updatedUserPayload);

    return updatedUser as UserResponse;
  } catch (error: any) {
    console.error("Error updating user:", error);
    return null;
  }
};
