import { Models } from "react-native-appwrite";
import { UserResponse } from "./user.types";
import { LessonResponse } from "./lesson.types";

export enum ELessonStatus {
  Completed = "Completed",
  InProgress = "InProgress",
  Locked = "Locked",
}

export interface UserLessonProgressResponse extends Models.Document {
  status: ELessonStatus;
  dateCompleted: Date;
  user: UserResponse;
  lesson: LessonResponse;
}
