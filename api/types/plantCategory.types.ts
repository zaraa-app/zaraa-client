import { Models } from "react-native-appwrite";

export interface PlantCategory extends Models.Document {
  name: string;
  description: string;
}
