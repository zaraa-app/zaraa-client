import { Databases, Query } from "react-native-appwrite";
import { client, config, tableIds } from "../appwrite";
import { LessonQuestionResponse } from "../types/lessonQuestions.types";

const databases: Databases = new Databases(client);

export const getLessonQuestions = async (lessonId: string) => {
  try {
    const questions = await databases.listDocuments(config.databaseId, tableIds.lessonQuestions, [Query.equal("lesson", lessonId)]);

    if (!questions || !questions.documents) {
      return [];
    }

    return questions.documents as LessonQuestionResponse[];
  } catch (error) {
    console.error("Error fetching lesson questions:", error);
    return [];
  }
};
