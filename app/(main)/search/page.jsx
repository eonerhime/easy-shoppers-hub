"use client";

import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/lib/products/searchProducts";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Component() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const searchQuery = new URLSearchParams(window.location.search);
    const searchParam = searchQuery.get("searchTerm");

    setQuery(searchParam);
  }, [pathname]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (query) {
        setIsLoading(true);
        setError(null);

        try {
          const data = await searchProducts({ query });

          // Check if it's an error response
          if (data && data.success === false) {
            // setError(data.error);
            toast.error("Invalid search parameter");
            setProducts([]);
          } else if (Array.isArray(data)) {
            setProducts(data);
          } else {
            // setError("Unexpected response format");
            toast.error("Unexpected response format");
            setProducts([]);
          }
        } catch (err) {
          console.error("Client error:", err);
          setError(err.message);
          toast.error("Search failed: " + err.message);
          setProducts([]);
        }

        setIsLoading(false);
      } else {
        setIsLoading(false);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [query]);

  if (!query) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-500">No search term provided</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Search Results for "{query}"</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64 w-full">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64 w-full">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex justify-center items-center h-64 w-full">
              <p className="text-gray-500">No products found for "{query}"</p>
            </div>
          ) : (
            <div
              key="products"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            >
              {products.map((product) => (
                <div key={product.$id}>
                  <ProductCard item={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
