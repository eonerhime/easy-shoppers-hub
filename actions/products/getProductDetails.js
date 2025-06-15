"use server";

import { databases } from "@/lib/appwrite";

/**
 * Server Action: Get single product with its image
 * @returns {Promise} - Promise that resolves with a product details object
 */
export async function getProductDetails(documentId) {
  try {
    const document = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
      documentId // Document ID
    );

    console.log("Document retrieved:", document);
    return { success: true, data: document };
  } catch (error) {
    console.error("Error retrieving document:", error);

    return { success: false, error: error.message };
  }
}
