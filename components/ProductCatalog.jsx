// ProductCatalog.jsx
import React from "react";
import ProductCarousel from "./ProductCarousel";

const ProductCatalog = ({ category, products, onAddToCart }) => {
  // Don't render if no products
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <ProductCarousel
      products={products}
      onAddToCart={onAddToCart}
      categoryTitle={category}
    />
  );
};

export default ProductCatalog;
