import { Models } from "react-native-appwrite";
import { UserResponse } from "./user.types";



export interface UserDailyActivityResponse extends Models.Document {
  activityDate: Date;
  wasActive: boolean;
  user: UserResponse;
}
