"use client";

import dynamic from "next/dynamic";

const CheckoutPage = dynamic(() => import("@/components/CheckoutPage"), {
  ssr: false,
  loading: () => (
    <div className="max-h-screen flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900"></div>
    </div>
  ),
});

export default function CheckoutPageRoute() {
  return <CheckoutPage />;
}
