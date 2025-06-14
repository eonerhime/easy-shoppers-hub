// ProductCard.jsx
import React from "react";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ProductCard = ({ item, onAddToCart }) => {
  return (
    <div className="flex-shrink-0 w-48 h-80">
      {/* Fixed smaller dimensions */}
      <div className="group relative overflow-hidden h-full flex flex-col rounded-lg shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300">
        <Link
          href={`/product/${item.$id}`}
          className="relative w-full pt-[75%] bg-transparent"
        >
          <Image
            width={200}
            height={150}
            quality={80}
            src={item.imageUrl}
            alt={item.imageName}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 border-b border-gray-200"
          />
        </Link>

        <div className="p-3 flex-grow">
          {/* Reduced padding */}
          <Link href={`/product/${item.$id}`}>
            <h3 className="text-sm font-medium mb-1 text-gray-700 group-hover:text-purple-500 transition-colors duration-300 line-clamp-2">
              {item.name}
            </h3>
          </Link>
          <div
            className="text-gray-500 line-clamp-1 text-xs mb-2"
            dangerouslySetInnerHTML={{
              __html: item.description,
            }}
          />
          <p className="text-gray-900 font-semibold text-sm">
            ${item.price.toFixed(2)}
          </p>
        </div>

        <div className="p-3 pt-0">
          {/* Reduced padding */}
          <Button
            className="w-full bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 hover:from-blue-600 hover:via-teal-600 hover:to-green-600 text-white font-medium text-xs py-2 px-3 cursor-pointer" // Smaller button
            onClick={() => onAddToCart(item)}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Add to Cart
          </Button>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
