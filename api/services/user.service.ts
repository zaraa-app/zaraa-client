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

    if (!newAccount) throw new Error("Account creation failed");

    const avatarUrl = avatars.getInitials(name);

    await signUserIn({ email, password });

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
 * @returns {Promise<void>} - Resolves if the user was signed in successfully.
 * @throws {Error} - If the user was not signed in successfully.
 */
export const signUserIn = async ({ email, password }: AccountDetails) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
