"use server";

import { Query } from "appwrite";
import { databases } from "../appwrite";

export async function searchProducts({ query }) {
  console.log("Search Query:", query);

  // Validate search query
  if (!query) {
    return { success: false, error: "Enter a product name in the search bar" };
  }

  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID,
      [
        Query.or([
          Query.search("name", query),
          Query.search("brand", query),
          Query.search("category", query),
          Query.search("description", query),
          Query.search("subCategory", query),
        ]),
      ]
    );

    return response.documents;
  } catch (error) {
    console.error("Error searching products:", error);
    console.error("Error details:", error.message, error.code, error.type);

    // Return error object instead of throwing
    return { success: false, error: error.message };
  }
}
