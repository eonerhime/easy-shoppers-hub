"use client";

import { getProductsWithImages } from "@/lib/getProductsWithImages";
import ProductCatalog from "@/components/ProductCatalog";
import { Button } from "@/components/ui/button";
import useCartStore from "@/hooks/useCartStore";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (product) => {
    if (product) {
      addToCart({
        id: product.$id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.imageUrl,
      });

      toast.success("Added to Cart", {
        description: `${product.name} has been added to your cart.`,

        duration: 5000,
      });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { success, documents } = await getProductsWithImages();

        if (success) {
          const allProducts = documents;

          // Group products by category
          const grouped = allProducts.reduce((acc, product) => {
            const category = product?.category;
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(product);
            return acc;
          }, {});

          setGroupedProducts(grouped);
          setProducts(allProducts); // Keep original if needed elsewhere
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 ">
          <div className="relative overflow-hidden rounded-lg shadow-lg ">
            <div className="w-full h-[400px] relative">
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 bg-clip-text text-transparent z-3">
                  Welcome to our Store!
                </h2>
                <p className="text-xl mb-8 text-gray-700 z-4">
                  Discover the latest trends and exclusive deals on your
                  favorite products. Shop now and enjoy a seamless shopping
                  experience!
                </p>
                <Image
                  width={675}
                  height={380}
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Hero Image"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 z-1"
                />
                <Button className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 hover:from-blue-600 hover:via-teal-600 hover:to-green-600 text-white z-2 cursor-pointer">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900"></div>
          </div>
        )}

        {Object.entries(groupedProducts)
          // Sort categories alphabetically
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([category, categoryProducts]) => (
            <ProductCatalog
              key={category}
              category={category}
              products={categoryProducts}
              onAddToCart={handleAddToCart}
            />
          ))}
      </main>
    </div>
  );
}
