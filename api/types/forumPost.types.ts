import { Models } from "react-native-appwrite";
import { UserResponse } from "./user.types";

export interface ForumPostResponse extends Models.Document {
  title: string;
  body: string;
  user: UserResponse;
}
