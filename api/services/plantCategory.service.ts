import { Databases } from "react-native-appwrite";
import { client, config, tableIds } from "../appwrite";
import { PlantCategory } from "../types/plantCategory.types";
import CactusIcon from "@/assets/icons/cactus-icon.svg";
import SucculentIcon from "@/assets/icons/succulent-icon.svg";
import PlantIcon from "@/assets/icons/plant-icon.svg";
import HerbsIcon from "@/assets/icons/herbs-icon.svg";

const databases: Databases = new Databases(client);

/**
 * Retrieves a list of plant categories from the database.
 * @returns {Promise<PlantCategory[] | undefined>} - A promise that resolves to an array of PlantCategory objects if successful, otherwise undefined.
 * @throws {Error} - If there is an error fetching the categories from the database.
 */
export const getCategories = async (): Promise<PlantCategory[] | undefined> => {
  try {
    const categories = await databases.listDocuments(config.databaseId, tableIds.plantCategories);
    return categories.documents as PlantCategory[];
  } catch (error: any) {
    console.log("Error getting categories:", error);
    return undefined;
  }
};

/**
 * Returns the appropriate icon for a given plant category.
 * @param {PlantCategory} category - The plant category for which to retrieve the icon.
 * @returns {any} - The icon corresponding to the plant category.
 */
export const getCategoryIcon = (category: PlantCategory): any => {
  switch (category.name) {
    case "Cacti":
    case "Cactus":
      return CactusIcon;
    case "Succulents":
      return SucculentIcon;
    case "Herbs":
      return HerbsIcon;
    default:
      return PlantIcon;
  }
};
