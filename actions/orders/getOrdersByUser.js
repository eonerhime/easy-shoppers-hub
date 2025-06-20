"use server";

import { Query } from "appwrite";
import { databases } from "@/lib/appwrite";

export async function getOrdersByUser(userId) {
  console.log("Fetching orders for user:", userId);

  // Ensure user is authenticated
  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const orderDetails = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    // Return all matching orders
    return { success: true, data: orderDetails.documents };
  } catch (error) {
    console.error("Error retrieving order:", error);
    return { success: false, error: error.message };
  }
}

