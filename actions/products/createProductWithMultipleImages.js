"use server";

import { databases, storage, ID } from "@/lib/appwrite";

/**
 * Server Action: Create a product with multiple images
 * @param {FormData} formData - Form data containing product info and images
 * @returns {Promise} - Promise that resolves with product creation response
 */
export async function createProductWithMultipleImages(formData) {
  try {
    const imageFiles = formData.getAll("images");
    const name = formData.get("name");
    const description = formData.get("description");
    const price = parseFloat(formData.get("price"));
    const category = formData.get("category");

    if (!imageFiles || imageFiles.length === 0) {
      return { success: false, error: "No image files provided" };
    }

    // Upload all images
    const uploadPromises = imageFiles.map((file) =>
      storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
        ID.unique(),
        file
      )
    );

    const fileResponses = await Promise.all(uploadPromises);

    // Prepare image data for the document
    const images = fileResponses.map((fileResponse) => ({
      id: fileResponse.$id,
      name: fileResponse.name,
      url: `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileResponse.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
    }));

    // Create product document
    const productDocument = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID,
      ID.unique(),
      {
        name,
        description,
        price,
        category,
        // Store images as JSON array
        images: JSON.stringify(images),
        // Main image (first uploaded image)
        mainImageId: fileResponses[0].$id,
        mainImageUrl: `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileResponses[0].$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    return {
      success: true,
      data: {
        product: productDocument,
        images: fileResponses,
      },
    };
  } catch (error) {
    console.error("Product creation with multiple images error:", error);
    return { success: false, error: error.message };
  }
}
