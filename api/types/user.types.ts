import { Models } from "react-native-appwrite";
import { Language } from "../enums/Language.enum";

export interface UserResponse extends Models.Document {
  name: string;
  avatar: URL;
  email: string;
  phoneNumber?: string;
  country?: string;
  dateOfBirth?: string;
  language?: Language;
  xp: number;
  hearts: number;
  streak: number;
  preferences?: string[];
}
