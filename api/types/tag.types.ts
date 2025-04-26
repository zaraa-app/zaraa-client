import { Models } from "react-native-appwrite";
import { ForumPostResponse } from "./forumPost.types";

export interface TagResponse extends Models.Document {
  name: string;
  forumPosts: ForumPostResponse[];
}
