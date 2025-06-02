import { Models } from "react-native-appwrite";
import { ChapterResponse } from "./chapter.types";

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
  index: number;
  chapter: ChapterResponse;
}
