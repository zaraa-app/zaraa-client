import { AccountDetails } from "@/app/(auth)/sign-up";
import { client, tableIds, config } from "../appwrite";
import { Account, Avatars, Databases, ID } from "react-native-appwrite";
import { UserResponse } from "../types/user.types";

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

    const request: UserResponse = {
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
    console.error("Error creating user:", error);
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
    console.error("Sign-in failed:", error);
    return null;
  }
};

/**
 * Retrieves the current user's account information.
 * @returns {Promise<UserResponse | null>} - The current user's data if successful, otherwise null.
 * @throws {Error} - If there is no current account or user found.
 */

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw new Error("No current account found");

    const currentUser = await databases.getDocument(config.databaseId, tableIds.users, currentAccount.$id);

    if (!currentUser) throw new Error("No current user found");

    return currentUser;
  } catch (error: any) {
    console.error("Error getting current user:", error);
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
    console.error("Error logging out:", error);
  }
};
