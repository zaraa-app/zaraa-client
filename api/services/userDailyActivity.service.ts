import { Databases, ID, Query } from "react-native-appwrite";
import { client, config, tableIds } from "../appwrite";
import { UserDailyActivityResponse } from "../types/userDailyActivity.types";
import { incrementStreak, resetStreak } from "./user.service";

const databases: Databases = new Databases(client);

const formatDateUTC = (date: Date): string => date.toISOString().split("T")[0];

/**
 * Retrieves a list of user daily activity records.
 * @param {string} userId - The ID of the user to retrieve the daily activity for.
 * @returns {Promise<UserDailyActivityResponse[] | undefined>} - A promise that resolves to an array of UserDailyActivityResponse objects if successful, otherwise undefined.
 * @throws {Error} - If there is an error fetching the daily activity from the database.
 */
export const getUserDailyActivity = async (userId: string): Promise<UserDailyActivityResponse[] | undefined> => {
  try {
    const dailyActivity = await databases.listDocuments(config.databaseId, tableIds.userDailyActivity, [Query.equal("user", userId)]);
    return dailyActivity.documents as UserDailyActivityResponse[];
  } catch (error: any) {
    console.log("Error getting user daily activity:", error);
  }
};

/**
 * Creates a user daily activity record.
 * @param {string} userId - The ID of the user to create the daily activity for.
 * @returns {Promise<void>} - A promise that resolves to void if successful, otherwise rejects with an error.
 * @remarks
 * - If the user already has a daily activity record for today, this function does nothing.
 * - If the user does not have a daily activity record for yesterday, it resets the user's streak.
 * - It creates a new daily activity record for today.
 * - It increments the user's streak.
 */
export const createUserDailyActivity = async (userId: string) => {
  try {
    const todaysDate = new Date();
    const todayStr = formatDateUTC(todaysDate);
    const yesterdayStr = formatDateUTC(new Date(todaysDate.getTime() - 86400000));

    const activities = await getUserDailyActivity(userId);

    if (activities) {
      const hasActivityToday = activities.some((activity) => {
        const activityDateStr = formatDateUTC(new Date(activity.activityDate));
        return activityDateStr === todayStr;
      });

      const hasActivityYesterday = activities.some((activity) => {
        const activityDateStr = formatDateUTC(new Date(activity.activityDate));
        return activityDateStr === yesterdayStr;
      });

      if (hasActivityToday) {
        return;
      }

      if (!hasActivityYesterday) {
        await resetStreak(userId);
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
