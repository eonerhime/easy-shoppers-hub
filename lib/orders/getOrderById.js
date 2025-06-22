"use server";

import { Query } from "appwrite";
import { databases } from "@/lib/appwrite";

export async function getOrderById(orderNumber) {
  if (!orderNumber) {
    return { success: false, error: "Order number is required" };
  }

  try {
    const orderDetails = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID,
      [Query.equal("orderNumber", orderNumber)]
    );

    // Return the first (should be only) matching order
    return { success: true, data: orderDetails.documents[0] };
  } catch (error) {
    console.error("Error retrieving order:", error);
    return { success: false, error: error.message };
  }
}
