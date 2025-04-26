import { Databases, Query } from "react-native-appwrite";
import { client, config, tableIds } from "../appwrite";
import { APPWRITE_DATABASE_ID } from "@env";

const databases: Databases = new Databases(client);

const getQuestionOptionsByLessonQuestion = async (lessonQuestionId: string) => {

    try {
        const response = await databases.listDocuments(
           APPWRITE_DATABASE_ID, // database ID
          "67b43b20003e4ad89486", // questionOptions collection ID
          
        );
        return response.documents;
      } catch (error) {
        console.error("Failed to fetch question options:", error);
        return [];
      }
};


