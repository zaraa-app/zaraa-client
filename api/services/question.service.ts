import { Databases, Query } from "react-native-appwrite";
import { client, config } from "../appwrite";

const databases = new Databases(client);

export const getLessonQuestionWithOptions = async (questionId: string) => {
  try {
    const question = await databases.getDocument(config.databaseId, config.lessonQuestionsCollectionId, questionId);
    const options = await databases.listDocuments(config.databaseId, config.questionOptionsCollectionId, [
      Query.equal("questionId", questionId),
    ]);

    return {
      question,
      options: options.documents,
    };
  } catch (error) {
    console.error("Error fetching question and options:", error);
    return null;
  }
};
