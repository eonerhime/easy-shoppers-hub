import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
// import useCartStore from "@/stores/cartStore";
import { toast } from "sonner";
import Image from "next/image";

const ProductCard = ({ item }) => {
  // const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (item) => {
    addToCart({
      // id: product.id,
      // name: product.attributeValues.p_title.value || "Product",
      // price: product.attributeValues.p_price.value,
      // quantity: 1,
      // image: product.attributeValues.p_image.value.downloadLink,
    });
    toast("Add to Cart", {
      description: `${item.name} has been added to your cart.`,
      duration: 5000,
    });
  };

  return (
    <div>
      <div className="group relative overflow-hidden group h-full flex flex-col rounded-lg shadow-lg border-2 border-gray-200 bg-white">
        <Link
          href={`/item/${item.$id}`}
          className="relative w-full pt-[100%] bg-transparent"
        >
          <Image
            width={300}
            height={300}
            quality={80}
            src={item.imageUrl}
            alt={item.imageName}
            className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 border-b-2 border-gray-200"
          />
        </Link>

        <div className="p-4 flex-grow">
          <Link href={`/product/${item.$id}`}>
            <h3 className="text-xl mb-2 text-gray-700 group-hover:text-purple-500 transition-colors duration-300 line-clamp-2">
              {item.name}
            </h3>
          </Link>

          <div
            className="text-gray-500 line-clamp-2 text-sm mb-2"
            dangerouslySetInnerHTML={{
              __html: item.description,
            }}
          />

          <p className="text-gray-600">${item.price.toFixed(2)}</p>
        </div>

        <div className="p-4">
          <Button
            className="w-full bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 hover:from-blue-600 hover:via-teal-600 hover:to-green-600 text-white font-semibold cursor-pointer"
            onClick={() => handleAddToCart(item)}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>

          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 hover:from-blue-600 hover:via-teal-600 hover:to-green-600 text-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
