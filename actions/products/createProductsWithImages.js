"use server";

import { databases, storage, ID } from "@/lib/appwrite";

/**
 * Server Action: Create a product with image upload
 * @param {FormData} formData - Form data containing product info and image
 * @returns {Promise} - Promise that resolves with product creation response
 */
export async function createProductWithImage(formData) {
  let fileResponse = null;

  try {
    const file = formData.file;
    const name = formData.productName;
    const description = formData.productDescription;

    // Clean and parse the price - remove $ and other non-numeric characters
    const priceString = formData.productPrice?.toString() || "0";
    const cleanedPrice = priceString.replace(/[$,\s]/g, ""); // Remove $, commas, spaces
    const price = parseFloat(cleanedPrice);
    // Validate the price
    if (isNaN(price) || price < 0) {
      return { success: false, error: "Invalid price value" };
    }

    const category = formData.productCategory;
    const subCategory = formData.productSubCategory;
    const gender = formData.productGender;
    const brand = formData.productBrand;
    const sizes = formData.productSizes;
    const quantity = parseInt(formData.productQuantity, 10);
    const sku = formData.productSku;
    const isActive = formData.isActive;

    if (!file) {
      return { success: false, error: "No image file provided" };
    }

    // Upload image first
    fileResponse = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
      ID.unique(),
      file
    );

    console.log("File Response:", fileResponse);

    // Create product document with image reference
    const productDocument = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID,
      ID.unique(),
      {
        description,
        name,
        price,
        category,
        subCategory,
        gender,
        brand,
        sizes,
        quantity,
        sku,
        isActive,
        // Image-related fields
        imageId: fileResponse.$id,
        imageName: fileResponse.name,
        imageUrl: `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileResponse.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
      }
    );

    return {
      success: true,
      data: {
        product: productDocument,
        image: fileResponse,
      },
    };
  } catch (error) {
    console.error("Product creation error:", error);

    // If document creation failed but file was uploaded, clean up the file
    if (fileResponse) {
      try {
        await storage.deleteFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
          fileResponse.$id
        );
        console.log("Successfully cleaned up uploaded file");
      } catch (deleteError) {
        console.error("Failed to cleanup uploaded file:", deleteError);
      }
    }

    return { success: false, error: error.message };
  }
}
