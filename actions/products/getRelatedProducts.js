"use server";

import { Query } from "appwrite";
import { databases } from "@/lib/appwrite";

export async function getRelatedProducts(category) {
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
      [Query.equal("category", category), Query.limit(10)]
    );

    return response.documents;
  } catch (error) {
    console.error("Error fetching related products by category:", error);
    throw error;
  }
}
