import { getOrderById } from "@/lib/orders/getOrderById";
import Button from "@/components/Button";

export async function generateMetadata({ params }) {
  const { orderId } = await params;

  return {
    title: `Order Confirmation - Order #${orderId}`,
    description: "Your order has been successfully placed and confirmed.",
  };
}

export default async function OrderConfirmationPage({ params }) {
  const { orderId } = await params;

  // Fetch order data
  const { success, data } = await getOrderById(orderId);

  // If order doesn't exist, show 404
  if (!success) {
    notFound();
  }

  const productDetails = JSON.parse(data.products);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Order Details
              </h2>
              <p className="text-sm text-gray-600">Order #{data.orderNumber}</p>
              <p className="text-sm text-gray-600">
                Placed on {new Date(data.orderDate).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  data.paymentStatus === "confirmed"
                    ? "bg-green-100 text-green-800"
                    : data.paymentStatus === "processing"
                    ? "bg-yellow-100 text-yellow-800"
                    : data.paymentStatus === "shipped"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {data?.paymentStatus?.charAt(0).toUpperCase() +
                  data?.paymentStatus?.slice(1)}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Items Ordered
            </h3>
            <div className="space-y-4">
              {productDetails?.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.productImage || "/placeholder-image.jpg"}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.productName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Qty: {item.productCount}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ${(item.productPrice * item.productCount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-bold">
                  $
                  {data.subtotal.toLocaleString("en-us", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  $
                  {data?.shipping?.toLocaleString("en-us", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">
                  $
                  {data?.taxAmount?.toLocaleString("en-us", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || "0.00"}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    $
                    {(data.totalAmount + data.taxAmount).toLocaleString(
                      "en-us",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      {data.shipToAddress && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Shipping Address
            </h3>
            <div className="text-sm text-gray-600">
              <p>{data.shipToAddress}</p>
              <p>
                {data.shipToCity}, {data.shipToState} {data.zipCode}
              </p>
              <p>{data.shipToCountry}</p>
            </div>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">What's Next?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• You'll receive an email confirmation shortly</li>
          <li>• We'll notify you when your order ships</li>
          <li>• Track your order status in your account</li>
          <li>
            • Estimated delivery:{" "}
            {data.estimatedDelivery || "3-5 business days"}
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors divide-slate-500"
          disabled={!success}
        >
          Track Order
        </button>
        <Button
          targetPath="/"
          style="flex-1 bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
