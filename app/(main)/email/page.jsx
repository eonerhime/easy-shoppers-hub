"use client";

import { sendOrderConfirmation } from "@/actions/orders/sendOrderConfirmation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const products = [
  {
    product_name: "Satchel Leather Bag",
    units: 2,
    price: 250,
    item: "https://fra.cloud.appwrite.io/v1/storage/buckets/684b4be70010ca17\t7c09/files/684d83c60032218c489c/view?project=\t684722780029a7ee6184",
  },
  {
    product_name: "Casual Swede Shoes",
    units: 3,
    price: 150,
    item: "https://fra.cloud.appwrite.io/v1/storage/buckets/684b4be70010ca17\t7c09/files/684dd03c00246526e7b5/view?project=\t684722780029a7ee6184",
  },
];

const orderData = {
  email: "emo.onerhime@gmail.com",
  orderNumber: "ORD-604660013",
  name: "Emo Onerhime",
  subtotal: 900,
  taxAmount: 90,
  // shippingAmount: 20,
  totalAmount: 920,
  paymentStatus: "confirmed",
  orderNotes: "Delivery should be before 5pm",
  shipToAddress: "T22U1 Lekki Gardens Phase 4",
  shipToCity: "Lagos",
  zipCode: "101245",
  orderDate: "2025-06-21T19:53:24.660+00:00",
  products,
};

function EmailNotification() {
  const [emailStatus, setEmailStatus] = useState("Sending...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sendOrderEmail = async () => {
      try {
        setIsLoading(true);
        const result = await sendOrderConfirmation(orderData);

        if (result.success) {
          setEmailStatus("Email sent successfully!");
          toast.success("Email sent successfully!");
        } else {
          setEmailStatus(`Email failed: ${result.error}`);
          toast.error(`Email failed: ${result.error}`);
        }
      } catch (error) {
        setEmailStatus(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    sendOrderEmail();
  }, []);

  return (
    <div className="p-4 border rounded max-w-md">
      <h3 className="font-semibold mb-2">Email Status Demo:</h3>
      <p className="text-sm text-gray-600 mb-3">
        This demo simulates your sendOrderConfirmation function
      </p>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>{emailStatus}</span>
        </div>
      ) : (
        <div
          className={`p-2 rounded ${
            emailStatus.includes("successfully")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {emailStatus}
        </div>
      )}
    </div>
  );
}

export default EmailNotification;
