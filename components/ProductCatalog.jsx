// import ProductCard from "./ProductCard";

import ProductCard from "./ProductCard";

const ProductCatalog = ({ category, products }) => {
  return (
    <section className="mb-12">
      <h2 className="text-3xl capitalize font-bold mb-8 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
        {category}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products?.map((item) => (
          <ProductCard key={item.$id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default ProductCatalog;
