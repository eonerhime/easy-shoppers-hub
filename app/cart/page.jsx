"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TAX_RATE } from "@/config/constants";
import useCartStore from "@/hooks/useCartStore";
import { account } from "@/lib/appwrite";
import {
  ArrowDown,
  ArrowLeft,
  CreditCard,
  LogIn,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cart);
  const setOrderItems = useCartStore((state) => state.setOrderItems);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Simulate loading state for 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch user session on component mount
  useEffect(() => {
    async function fetchUser() {
      try {
        setIsLoading(true);

        const userData = await account.get();

        if (userData) {
          // User IS authenticated
          setUser(userData);
        } else {
          // User is NOT authenticated - redirect to auth
          router.push("/auth");
        }
      } catch (error) {
        console.error(`Error fetching user session:`, error);

        setUser(null);

        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * TAX_RATE; // Assuming 10% tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    const order = {
      userId: user.$id,
      status: "pending",
      subtotal,
      taxAmount: tax,
      totalAmount: total,
      currency: "USD",
      name: user.name,
      email: user.email,
      products: cartItems.map((product) => ({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        productCount: product.quantity,
        productImage: product.image,
      })),
    };

    // Put the order in state
    setOrderItems(order);

    // Route user to the Checkout page
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen  p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
          Your Cart
        </h1>

        {/* Back button to previous page */}
        <button
          className="mb-8 flex items-center text-purple-500 hover:text-purple-600 transition-colors duration-300 cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </button>

        {/* Show spinner while products are fetched */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900"></div>
          </div>
        ) : (
          // Display retrieved products
          <>
            <div>
              {cartItems.map((product) => (
                <div
                  key={product.id}
                  className=" p-4 sm:p-6 rounded-lg shadow-lg mb-4 relative overflow-hidden border-2 border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <Image
                        width={64}
                        height={64}
                        quality={80}
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                      />

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent line-clamp-1">
                          {product.name}
                        </h3>

                        <p className="text-gray-400">
                          ${product?.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end sm:flex-1">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="icon"
                          onClick={() =>
                            updateQuantity(product.id, product.quantity - 1)
                          }
                          className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 hover:from-blue-600 hover:via-teal-600 hover:to-green-600 text-white cursor-pointer"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <Input
                          type="number"
                          min="0"
                          value={product.quantity}
                          onChange={(e) =>
                            updateQuantity(product.id, parseInt(e.target.value))
                          }
                          className="w-16  border-gray-600 text-center bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 bg-clip-text text-transparent"
                        />

                        <Button
                          size="icon"
                          onClick={() =>
                            updateQuantity(product.id, product.quantity + 1)
                          }
                          className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 hover:from-blue-600 hover:via-teal-600 hover:to-green-600 text-white cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(product.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200 ml-4 cursor-pointer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-6 rounded-lg border-gray-200 border-2 shadow-lg mt-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                Order Summary
              </h2>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>

                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>

                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-700 my-2"></div>

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>

                  <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Proceed to checkout only if user is logged in and cart has items; disable button if no cart items*/}
              {user && cartItems.length ? (
                <Button
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 hover:from-purple-600hover:from-blue-600 hover:via-teal-600 hover:to-green-600 text-white font-semibold cursor-pointer"
                  disabled={!cartItems.length}
                  onClick={handleCheckout}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Checkout
                </Button>
              ) : (
                <Button
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 hover:from-blue-600 hover:via-teal-600 hover:to-green-600 text-white font-semibold cursor-pointer"
                  disabled={!cartItems.length}
                  onClick={() => router.push("/auth?type=login")}
                >
                  {!cartItems.length ? (
                    <>
                      <p>Continue Shopping</p>
                      <ArrowDown className="h-12 w-12" />
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Login to Checkout
                    </>
                  )}
                </Button>
              )}
            </div>
          </>
        )}

        {/* If cart is empty */}
        {!isLoading && cartItems.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />

            <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
              Your cart is empty
            </h2>

            <p className="text-gray-400 mb-6">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>

            <Button
              className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 hover:from-blue-600 hover:via-teal-600 hover:to-green-600 text-white font-semibold cursor-pointer"
              onClick={() => router.push("/")}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
