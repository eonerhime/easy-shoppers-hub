"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/hooks/useCartStore";
import { ArrowLeft } from "lucide-react";
import createOrder from "@/actions/orders/create-order";
import { toast } from "sonner";
import { sendOrderConfirmation } from "@/actions/orders/sendOrderConfirmation";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [checkoutItems, setCheckoutItems] = useState({});
  // Zustand store hooks - used only after client-side hydration
  const orderItems = useCartStore((state) => state.orderItems);
  const setOrderItems = useCartStore((state) => state.setOrderItems);
  const cartItems = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Store order items to state on page load
  useEffect(() => {
    if (orderItems && orderItems.name) {
      setCheckoutItems({
        ...orderItems,
      });
    }
  }, [orderItems, isClient]);

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
        zipCode: formData.get("zipCode") || "",
        country: formData.get("country") || "",
      };

      // Update order items in state with updated order details
      setOrderItems(updatedCheckoutItems);

      // Create the order
      const result = await createOrder(checkoutItems);

      if (result.success) {
        toast.success("Order placed successfully!", result.orderNumber);

        // Call fnx to send order confirmation email
        sendOrderConfirmation(checkoutItems);

        // Redirect to order confirmation page
        router.push(`/order-confirmation/${result.orderNumber}`);

        // Clear cart state
        clearCart();

        return result;
      } else {
        toast.error("Order creation failed:", result.error);
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading until client-side hydration
  if (!isClient) {
    return (
      <div className="max-h-screen flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900"></div>
      </div>
    );
  }

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
              value={orderItems?.name?.split(" ")?.at(1) || ""}
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
                required
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
                required
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
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total: </span>
              <span>
                $
                {cartItems
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(2)}
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
