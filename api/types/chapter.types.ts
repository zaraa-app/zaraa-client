import { Models } from "react-native-appwrite";

export interface ChapterResponse extends Models.Document {
  title: string;
  description: string;
  chapterNumber: number;
}
