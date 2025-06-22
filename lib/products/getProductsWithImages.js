"use server";

import { databases, storage, ID } from "@/lib/appwrite";

/**
 * Server Action: Get all products with their images
 * @returns {Promise} - Promise that resolves with products list
 */
export async function getProductsWithImages() {
  try {
    // Fetch all documents from the products collection
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID
    );

    return {
      success: true,
      documents: response.documents,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    console.error("Error details:", error.code, error.type);
    return { success: false, error: error.message };
  }
}
