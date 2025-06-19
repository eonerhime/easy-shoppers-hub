"use client";

import useCartStore from "@/hooks/useCartStore";
import { resend } from "@/lib/resend";
import { useEffect } from "react";
import { toast } from "sonner";

export function sendOrderConfirmation() {
  const orderData = useCartStore((state) => state.orderItems);

  useEffect(() => {
    const orderConfirmation = async () => {
      try {
        const { data, error } = await resend.emails.send({
          from: "orders@easyshoppershub.com",
          to: [orderData.email],
          subject: `Order Confirmation - ${orderData.orderNumber}`,
          html: `
      <h2>Thank you for your order!</h2>
      <p>Order Number: <strong>${orderData.orderNumber}</strong></p>
      <p>Order Date: ${new Date(orderData.orderDate).toLocaleDateString()}</p>
      <p>Total: ${orderData.total}</p>
      <p>Shipping Address: ${orderData.shipToAddress}, ${orderData.shipToCity}</p>
      <p>We'll send you tracking information once your order ships.</p>
      `,
        });

        if (error) {
          toast.error("Email send failed:", error);
          return false;
        }

        toast.success("Order confirmation sent:");
        return true;
      } catch (error) {
        console.error("Email error:", error);
        return false;
      }
    };
    orderConfirmation();
  }, []);
}
