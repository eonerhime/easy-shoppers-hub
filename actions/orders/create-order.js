import { databases, ID } from "@/lib/appwrite";

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp}${random}`;
}

export default async function createOrder(orderDetails) {
  try {
    // Complete order document details
    const orderDocument = {
      ...orderDetails,
      orderNumber: generateOrderNumber(),
      paymentStatus: "confirmed",
      paymentMethod: orderDetails.paymentMethod || "stripe",

      // Order items as JSON string
      products: JSON.stringify(orderDetails.products),

      // Timestamps
      orderDate: new Date().toISOString(),
    };

    // Create the order document
    const order = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID,
      ID.unique(),
      orderDocument
    );

    return {
      success: true,
      order: order,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
