import { Databases, ID, Query } from "react-native-appwrite";
import { client, config, tableIds } from "../appwrite";
import { UserDailyActivityResponse } from "../types/userDailyActivity.types";
import { UserResponse } from "../types/user.types";
import { incrementStreak, resetStreak } from "./user.service";

const databases: Databases = new Databases(client);

/**
 * Retrieves a user's daily activity history.
 * @param {string} userId - The id of the user to get the daily activity for.
 * @returns {Promise<UserDailyActivityResponse[] | undefined>} - A promise that resolves to an array of UserDailyActivityResponse objects if successful, otherwise undefined.
 * @throws {Error} - If there is an error getting the user's daily activity.
 */
export const getUserDailyActivity = async (userId: string) => {
  try {
    const dailyActivity = await databases.listDocuments(config.databaseId, tableIds.userDailyActivity, [Query.equal("user", userId)]);

    return dailyActivity.documents as UserDailyActivityResponse[];
  } catch (error: any) {
    console.log("Error getting user daily activity:", error);
  }
};

/**
 * Creates a new user daily activity record.
 * @param {string} userId - The id of the user to create the daily activity for.
 * @returns {Promise<void>} - A promise that resolves once the daily activity has been created.
 * @throws {Error} - If there was an error creating the daily activity.
 *
 * If a daily activity for the current day already exists, does nothing.
 */
export const createUserDailyActivity = async (userId: string) => {
  try {
    const todaysDate = new Date();
    const activities = await getUserDailyActivity(userId);

    if (activities) {
      const hasActivityToday = activities.some((activity) => {
        const activityDate = new Date(activity.activityDate);
        return (
          activityDate.getDate() === todaysDate.getDate() &&
          activityDate.getMonth() === todaysDate.getMonth() &&
          activityDate.getFullYear() === todaysDate.getFullYear()
        );
      });

      const hasActivityYesterday = activities.some((activity) => {
        const activityDate = new Date(activity.activityDate);
        return (
          activityDate.getDate() === todaysDate.getDate() - 1 &&
          activityDate.getMonth() === todaysDate.getMonth() &&
          activityDate.getFullYear() === todaysDate.getFullYear()
        );
      });

      if (hasActivityToday) {
        return;
      }

      if (!hasActivityYesterday) {
        await resetStreak(userId);
        return;
      }
    }

    const userActivity = {
      activityDate: todaysDate,
      wasActive: true,
      user: userId,
    };

    await databases.createDocument(config.databaseId, tableIds.userDailyActivity, ID.unique(), userActivity);
    await incrementStreak(userId);
  } catch (error: any) {
    console.error("Error creating user daily activity:", error);
  }
};
