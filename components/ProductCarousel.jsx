import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const ProductCarousel = ({ products, onAddToCart, categoryTitle }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200; // Width of one card plus gap
      const newScrollLeft =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      // Check scroll buttons after animation
      setTimeout(checkScrollButtons, 300);
    }
  };

  // Initialize scroll button states when component mounts
  React.useEffect(() => {
    checkScrollButtons();
  }, [products]);

  return (
    <div className="mb-8">
      {/* Category Title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="capitalize text-2xl font-bold text-gray-800">
          {categoryTitle}
        </h2>

        {/* Navigation Buttons */}
        {products.length > 5 && (
          // Only show navigation if there are more than 5 products
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border transition-colors ${
                canScrollLeft
                  ? "border-gray-300 hover:bg-gray-100 text-gray-600 hover:text-gray-800"
                  : "border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border transition-colors ${
                canScrollRight
                  ? "border-gray-300 hover:bg-gray-100 text-gray-600 hover:text-gray-800"
                  : "border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Scrollable Products Container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.$id}
              item={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
