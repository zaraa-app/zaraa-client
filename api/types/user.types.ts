import { Models } from "react-native-appwrite";
import { ELanguage } from "../enums/Language.enum";

export interface UserResponse extends Models.Document {
  name: string;
  avatar: URL;
  email: string;
  phoneNumber?: string;
  country?: string;
  dateOfBirth?: string;
  language?: ELanguage;
  xp: number;
  hearts: number;
  streak: number;
  preferences?: string[];
}
