"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import useCartStore from "@/hooks/useCartStore";
import { getProductDetails } from "@/actions/products/getProductDetails";
import ProductCatalog from "@/components/ProductCatalog";
import { toast } from "sonner";
import Image from "next/image";
import { getRelatedProducts } from "@/actions/products/getRelatedProducts";

export default function ProductDetailPage({ params }) {
  const [documentId, setDocumentId] = useState(null);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const getParams = async () => {
      const { productId: documentId } = await params;

      setDocumentId(documentId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      if (!documentId) return;

      try {
        const { data: productDetails } = await getProductDetails(documentId);

        setProduct(productDetails);

        const relatedProductsData = await getRelatedProducts(
          productDetails.category
        );

        setRelatedProducts(relatedProductsData);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [documentId]);

  const handleAddToCart = () => {
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

  if (isLoading) {
    return (
      <div className=" flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <button
          className="mb-8 flex items-center text-purple-500 hover:text-purple-600 transition-colors duration-300 cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </button>

        {/* Product details */}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative overflow-hidden rounded-lg ">
            <Image
              width={500}
              height={500}
              priority
              quality={80}
              src={product.imageUrl}
              alt={product.name}
              className="object-contain w-full max-h-[400px] transition-transform duration-300 transform hover:scale-105"
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
              {product.name}
            </h1>

            <p className="text-xl font-semibold text-gray-700">
              {/* ${product.price.toFixed(2)} */}${product.price}
            </p>

            <div
              className="text-gray-500"
              dangerouslySetInnerHTML={{
                __html: product.description,
              }}
            />

            <div className="flex space-x-4">
              <Button
                className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-semibold cursor-pointer"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Related products */}

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <ProductCatalog
              title="Related Products"
              products={relatedProducts}
            />
          </section>
        )}
      </main>
    </div>
  );
}
