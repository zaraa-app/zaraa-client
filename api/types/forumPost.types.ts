import { Models } from "react-native-appwrite";
import { UserResponse } from "./user.types";
import { TagResponse } from "./tag.types";

export interface ForumPostResponse extends Models.Document {
  title: string;
  body: string;
  user: UserResponse;
  tags: TagResponse[];
}
