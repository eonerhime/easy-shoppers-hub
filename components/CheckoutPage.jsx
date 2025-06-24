"use client";

import createOrder from "@/actions/orders/create-order";
import { sendOrderConfirmation } from "@/actions/orders/sendOrderConfirmation";
import useCartStore from "@/hooks/useCartStore";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkoutItems, setCheckoutItems] = useState({});
  const router = useRouter();
  const pathname = usePathname();

  // Zustand store hooks - safe to use since component is client-only
  const orderItems = useCartStore((state) => state.orderItems);
  const setOrderItems = useCartStore((state) => state.setOrderItems);
  const cartItems = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const query = new URLSearchParams(window.location.search);
  const taxAmount = Number(query.get("tax"));

  // Store order items to state on page load
  useEffect(() => {
    if (orderItems && orderItems.name) {
      setCheckoutItems({
        ...orderItems,
      });
    }
  }, [orderItems]);

  const handleSubmitOrder = async (e) => {
    if (!e.target.checkValidity()) {
      return;
    }

    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get form data
      const formData = new FormData(e.target);

      const updatedCheckoutItems = {
        ...checkoutItems,
        phone: formData.get("phone") || "",
        orderNotes: formData.get("notes") || "",
        shipToAddress: formData.get("address") || "",
        shipToCity: formData.get("city") || "",
        shipToState: formData.get("state") || "",
        country: formData.get("country") || "",
        zipCode: formData.get("zipCode") || "",
        totalAmount: cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };

      setCheckoutItems(updatedCheckoutItems);

      // Create the order
      const { success, order, error } = await createOrder(updatedCheckoutItems);

      if (success) {
        toast.success("Order placed successfully!");

        try {
          const emailResult = await sendOrderConfirmation(order);

          console.log("SEND RESULT:", emailResult);

          if (emailResult.success) {
            toast.success("Confirmation email sent successfully!");
          } else {
            console.error("Email failed to send:", emailResult.error);

            toast.warning(
              "Order created but confirmation email failed to send"
            );
          }
        } catch (emailError) {
          console.error("Email sending error:", emailError);
          toast.warning("Order created but confirmation email failed to send");
        }

        // Clear cart state
        clearCart();

        // Update order items in state with updated order details
        setOrderItems(order);

        // Redirect to order confirmation page
        router.push(`/order-confirmation/${order.orderNumber}`);
      } else {
        toast.error("Order creation failed: " + error);
        throw new Error(error); // Fixed: was using result.error instead of error
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
        Checkout
      </h1>

      {/* Back button to previous page */}
      <button
        className="mb-8 flex items-center text-purple-500 hover:text-purple-600 transition-colors duration-300 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="space-y-4">
        {/* Customer Information */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Customer Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="firstName"
              placeholder="First Name"
              value={checkoutItems?.name?.split(" ")?.at(0) || ""}
              onChange={(e) =>
                setCheckoutItems((prev) => ({
                  ...prev,
                  name: `${e.target.value} ${prev.name?.split(" ")?.at(1)}`,
                }))
              }
              className="border rounded px-3 py-2"
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={checkoutItems?.name?.split(" ")?.at(1) || ""}
              onChange={(e) =>
                setCheckoutItems((prev) => ({
                  ...prev,
                  name: `${prev.name?.split(" ")?.at(0)} ${e.target.value}`,
                }))
              }
              className="border rounded px-3 py-2"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={orderItems?.email}
              onChange={(e) =>
                setCheckoutItems((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="border rounded px-3 py-2"
              required
            />
            <input
              name="phone"
              placeholder="Phone"
              className="border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Shipping Address */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Shipping Address</h2>
          <div className="space-y-3">
            <input
              name="address"
              placeholder="Address"
              required
              className="w-full border rounded px-3 py-2"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                name="city"
                placeholder="City"
                required
                className="border rounded px-3 py-2"
              />
              <input
                name="state"
                placeholder="State"
                className="border rounded px-3 py-2"
              />
              <input
                name="zipCode"
                placeholder="Zip Code"
                required
                className="border rounded px-3 py-2"
              />
              <input
                name="country"
                placeholder="Country"
                className="border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Order Notes */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Order Notes (Optional)</h2>
          <textarea
            name="notes"
            placeholder="Any special instructions..."
            rows="3"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Order Summary */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>
                $
                {(item.price * item.quantity).toLocaleString("en-us", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Subtotal: </span>
              <span>
                $
                {cartItems
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toLocaleString("en-us", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </span>
            </div>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Tax: </span>
              <span>
                $
                {taxAmount.toLocaleString("en-us", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Grand Total: </span>
              <span>
                ${" "}
                {(
                  cartItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  ) + taxAmount
                ).toLocaleString("en-us", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
