"use server";

import { databases, storage, ID } from "@/lib/appwrite";

/**
 * Server Action: Delete product and its associated images
 * @param {string} productId - Product document ID
 * @param {string[]} imageIds - Array of image file IDs to delete
 * @returns {Promise} - Promise that resolves when deletion is complete
 */
export async function deleteProductWithImages(productId, imageIds) {
  try {
    // Delete the document first
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID,
      productId
    );

    // Delete associated images
    if (imageIds && imageIds.length > 0) {
      const deletePromises = imageIds.map((imageId) =>
        storage.deleteFile(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID, imageId)
      );

      await Promise.all(deletePromises);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting product with images:", error);
    return { success: false, error: error.message };
  }
}
