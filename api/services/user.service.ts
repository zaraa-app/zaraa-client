import { AccountDetails } from "@/app/(auth)/sign-up";
import { client, tableIds, config } from "../appwrite";
import { Account, Avatars, Databases, ID, OAuthProvider } from "react-native-appwrite";
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
    console.error("Error logging out:", error);
  }
};

/**
 * Signs the user up with their Google account.
 * @returns {Promise<UserResponse>} - The newly created user account data if successful.
 * @throws {Error} - If the sign-up process fails.
 */
export const signUpWithGoogle = async () => {
  try {
    account.createOAuth2Session(OAuthProvider.Google, "http://localhost:8081", "http://localhost:8081/fail", ["email", "profile"]);

    // const authenticatedUser = await account.get();

    // if (!authenticatedUser || !authenticatedUser.$id) {
    //   throw new Error("Failed to retrieve user details after OAuth sign-in");
    // }

    // const avatarUrl = avatars.getInitials(authenticatedUser.name ?? "User");

    // const request: UserResponse = {
    //   name: authenticatedUser.name ?? "No Name",
    //   email: authenticatedUser.email,
    //   avatar: avatarUrl,
    //   hearts: 5,
    //   streak: 0,
    //   xp: 0,
    // };

    // let newUser = await databases.createDocument(config.databaseId, tableIds.users, authenticatedUser.$id, request);

    return null;
  } catch (error: any) {
    console.log("Error signing up with Google:", error);
    throw new Error(error.message);
  }
};

/**
 * Authenticates a user with their Google account.
 * If the user already exists in the database, fetches their user details.
 * Otherwise, creates a new user record with the user's Google profile details.
 * @returns {Promise<UserResponse>} - The user account data if successful.
 * @throws {Error} - If the authentication process fails.
 */
export const authenticateWithGoogle = async () => {
  try {
    // Initiate OAuth login
    account.createOAuth2Session(OAuthProvider.Google);

    // // Fetch authenticated user details
    // const authenticatedUser = await account.get();

    // if (!authenticatedUser || !authenticatedUser.$id) {
    //   throw new Error("Failed to retrieve user details after OAuth authentication");
    // }

    // // Check if the user already exists in the database
    // let user;
    // try {
    //   user = await databases.getDocument(config.databaseId, tableIds.users, authenticatedUser.$id);
    // } catch (error: any) {
    //   if (error.code !== 404) {
    //     console.error("Error fetching user:", error);
    //     throw new Error("Unexpected error while checking user existence.");
    //   }
    //   // User does not exist, so create a new record
    //   const avatarUrl = avatars.getInitials(authenticatedUser.name ?? "User");

    //   const newUser: UserResponse = {
    //     name: authenticatedUser.name ?? "No Name",
    //     email: authenticatedUser.email,
    //     avatar: avatarUrl,
    //     hearts: 5,
    //     streak: 0,
    //     xp: 0,
    //   };

    //   user = await databases.createDocument(config.databaseId, tableIds.users, authenticatedUser.$id, newUser);
    // }

    return null;
  } catch (error: any) {
    console.log("Error authenticating with Google:", error);
    throw new Error(error.message);
  }
};
