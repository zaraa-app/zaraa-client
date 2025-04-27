import { Models } from "react-native-appwrite";
import { LessonResponse } from "./lesson.types";

export enum EQuestionType {
  TextOnly = "TextOnly",
  WithImages = "WithImages",
}

export interface QuestionOptionResponse extends Models.Document {
  answerText: string;
  isCorrect: boolean;
  answerImage?: URL;
  question: LessonQuestionResponse;
}

export interface LessonQuestionResponse extends Models.Document {
  index: number;
  questionType: EQuestionType;
  questionText: string;
  questionImage?: URL;
  lesson: LessonResponse;
  options: QuestionOptionResponse[];
}
