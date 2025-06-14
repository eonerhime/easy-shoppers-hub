"use server";

import { account, databases, storage } from "@/lib/appwrite";
import { ID } from "appwrite";

/**
 * Server Action: Upload file and create database record
 * @param {FormData} formData - Form data containing file and other fields
 * @returns {Promise} - Promise that resolves with document creation response
 */
export async function uploadFileAndCreateDocument(formData) {
  try {
    const file = formData.file;
    const name = formData.productName;
    const description = formData.productDescription;
    const price = parseFloat(formData.productPrice);
    const category = formData.productCategory;
    const subCategory = formData.productSubCategory;
    const gender = formData.productGender;
    const brand = formData.productBrand;
    const sizes = formData.productSizes;
    const quantity = parseInt(formData.productQuantity, 10);
    const sku = formData.productSku;
    const isActive = formData.isActive || "true"; // Default to true if not provided

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Step 1: Upload file to storage
    const fileResponse = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
      ID.unique(),
      file
    );

    // Step 2: Create document in database with file reference
    const documentResponse = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
      ID.unique(),
      {
        name,
        description,
        price,
        category,
        subCategory,
        gender,
        brand,
        sizes,
        quantity,
        sku,
        isActive,
        // File-related fields
        fileId: fileResponse.$id,
        fileName: fileResponse.name,
        fileSize: fileResponse.sizeOriginal,
        fileMimeType: fileResponse.mimeType,
        fileUrl: `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileResponse.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    return {
      success: true,
      data: {
        file: fileResponse,
        document: documentResponse,
      },
    };
  } catch (error) {
    console.error("Upload and document creation error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Server Action: Create a product with image upload
 * @param {FormData} formData - Form data containing product info and image
 * @returns {Promise} - Promise that resolves with product creation response
 */
export async function createProductWithImage(formData) {
  let fileResponse = null; // Declare outside try block

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

    // Create product document with image reference
    const productDocument = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
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

/**
 * Server Action: Get all products with their images
 * @returns {Promise} - Promise that resolves with products list
 */
export async function getProductsWithImages() {
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID
    );

    return { success: true, data: response };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: error.message };
  }
}

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
