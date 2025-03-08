import { Models } from "react-native-appwrite";

export enum ELessonDifficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export interface LessonResponse extends Models.Document {
  title: string;
  content: string;
  xpValue: number;
  difficulty: ELessonDifficulty;
  avgTime: number;
  chapterId: string;
}
