"use client";

import { getOrdersByUser } from "@/actions/orders/getOrdersByUser";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { account } from "@/lib/appwrite";
import {
  AlertCircle,
  CheckCircle,
  Package,
  Truck,
  XSquareIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const orderStatusIcons = {
  processing: <Package className="w-5 h-5 text-yellow-500" />,

  shipped: <Truck className="w-5 h-5 text-white" />,

  delivered: <CheckCircle className="w-5 h-5 text-green-500" />,

  cancelled: <AlertCircle className="w-5 h-5 text-red-500" />,
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("Updated orders state:", orders);
    console.log("Items count:", orders.items.length);
  }, [orders]);

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        setIsLoading(true);

        // Get user session first
        const userData = await account.get();

        // Then fetch orders with user ID
        const response = await getOrdersByUser(userData.$id);

        const { data } = response;

        if (data) {
          setOrders({
            items: data.reverse(),
            total: data.length,
          });
        } else {
          setOrders({ total: 0, items: [] });
        }
      } catch (error) {
        console.error("Error:", error.message);
        setOrders({ total: 0, items: [] });

        // Handle no session case
        router.push("/auth?type=login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndOrders();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
          My Orders
        </h1>

        {/* Back button to previous page */}
        {/* <button
          className="mb-8 flex items-center text-purple-500 hover:text-purple-600 transition-colors duration-300 cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </button> */}

        {isLoading ? (
          <div className="flex items-center justify-center pt-7">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900"></div>
          </div>
        ) : (
          <>
            {orders?.items?.map((order) => {
              const products = JSON.parse(order.products);
              return (
                <div
                  key={order.$id}
                  className="bg-gray-100 rounded-lg shadow-lg mb-6 overflow-hidden border-2"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-semibold text-purple-500">
                        Order #{order.orderNumber}
                      </h2>

                      <Badge className={` text-white bg-purple-900`}>
                        {/* @js-ignore */}

                        {orderStatusIcons[order.status]}

                        <span className="ml-2 capitalize">{order.status}</span>
                      </Badge>
                    </div>

                    <div className="flex justify-between text-gray-600 mb-4">
                      <span>
                        Order Date: {order.orderDate.split("T").shift()}
                      </span>

                      <div className="flex flex-col">
                        <div className="flex flex-row justify-between font-bold">
                          <span>Grand Total: </span>
                          <span>
                            &nbsp; $
                            {order.totalAmount.toLocaleString("en-us", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "0.00"}
                          </span>
                        </div>
                        <div className="flex flex-row justify-between">
                          <span>Tax: </span>
                          <span>
                            &nbsp; $
                            {order.taxAmount.toLocaleString("en-us", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "0.00"}
                          </span>
                        </div>
                        <div className="flex flex-row justify-between font-bold">
                          <span>Total: </span>
                          <span>
                            &nbsp; $
                            {order.subtotal.toLocaleString("en-us", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "0.00"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="border-t border-gray-300 pt-4">
                        <div className="space-y-4 mt-4">
                          <div className="flex flex-col space-x-4">
                            {products.map((product) => (
                              <div
                                key={product.productId}
                                className="flex flex-row justify-between mr-0"
                              >
                                <div>
                                  <h3 className="font-semibold text-purple-500">
                                    {product.productName}
                                  </h3>

                                  <p className="text-gray-500">
                                    Quantity: {product.productCount}
                                  </p>
                                </div>

                                <span className="text-purple-500 font-semibold">
                                  ${product.productPrice.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {!isLoading && orders?.total === 0 && (
          <div className="text-center py-12 border-2 border-gray-200 rounded-lg bg-gray-100">
            <XSquareIcon className="mx-auto h-16 w-16 text-red-400 mb-4" />

            <h2 className="text-2xl font-semibold mb-2 text-blue-500">
              No orders found
            </h2>

            <p className="text-gray-400 mb-6">
              You haven&apos;t placed any orders yet. Start shopping now!
            </p>

            <Button
              className="flex-1 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 hover:from-green-600 hover:via-teal-500 hover:to-blue-500 text-white font-semibold cursor-pointer"
              onClick={() => router.push("/")}
            >
              Start Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
