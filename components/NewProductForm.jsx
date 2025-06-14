"use client";

import { createProductWithImage } from "@/actions/products/manageProductsActions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const initialFormData = {
  productName: "",
  productDescription: "",
  productPrice: "",
  productCategory: "",
  productSubCategory: "",
  productGender: "",
  productBrand: "",
  productSizes: "",
  productQuantity: 0,
};

const NewProductForm = () => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState(initialFormData);
  const [productQuantity, setProductQuantity] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const sku =
    formData.productSubCategory +
    "-" +
    formData.productGender +
    "-" +
    formData.productSizes;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Check if file is selected
    if (!file) return;

    // Validate file type
    if (file) {
      setSelectedFile(file);

      toast.success("File selected successfully");
    } else {
      setSelectedFile(null);
      toast.error("No file selected");
    }
  };

  useEffect(() => {
    console.log("Selected file state updated:", selectedFile);
  }, [selectedFile]);

  const handleSelectChange = (name) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle increase quantity
  const handleIncreaseQuantity = (e) => {
    e.preventDefault();
    setProductQuantity((prev) => prev + 1);
  };

  // Function to handle decrease quantity
  const handleDecreaseQuantity = (e) => {
    e.preventDefault();

    // Prevent negative quantity
    if (productQuantity > 0) {
      setProductQuantity((prev) => prev - 1);
    } else {
      toast.error("Quantity cannot be less than zero");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      formData.productQuantity = productQuantity;
      formData.isActive = "true";
      formData.productSku = sku;
      formData.file = selectedFile;

      console.log("Product details:", formData);

      const result = await createProductWithImage(formData);

      if (!result.success) throw new Error(result.error || "Unknown error");
      // Soft Satchel leather bag made from premium pigs skin

      toast(
        result.success
          ? "Product created successfully"
          : `Error creating product: ${result.error || "Unknown error"}`
      );

      setFormData(initialFormData);
      setProductQuantity(0);
      fileInputRef.current.value = null;

      return { result: result.success, data: result.data, error: result.error };
    } catch (error) {
      toast.error(`Error creating product: ${error.message}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="flex flex-col gap-4 p-4 border rounded-lg shadow-md"
    >
      <h1 className="mb-4 uppercase font-bold">New Product</h1>

      {/* Upload single product image */}
      <div>
        <Label htmlFor="image" className="block mb-2">
          Upload Product Image{" "}
        </Label>
        <Input
          type="file"
          ref={fileInputRef}
          name="productImage"
          accept="image/*"
          onChange={handleFileChange}
          className="border rounded-lg p-2 w-full max-w-xs"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        {/* Product name */}
        <input
          type="text"
          id="productName"
          name="productName"
          value={formData.productName}
          onChange={handleInputChange}
          placeholder="Enter product name"
          className="border rounded-lg p-2 w-full max-w-xs"
          required
        />

        {/* Product description */}
        <Textarea
          type="text"
          id="productDescription"
          name="productDescription"
          value={formData.productDescription}
          onChange={handleInputChange}
          placeholder="Enter product description"
          className="border rounded-lg p-2 w-full max-w-xs"
          required
        />

        {/* Product price */}
        <NumericFormat
          name="productPrice"
          value={formData.productPrice}
          onChange={handleInputChange}
          thousandSeparator=","
          prefix="$"
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          placeholder="$0.00"
          className="border rounded px-2 py-1 w-full max-w-xs"
        />

        {/* Product categories - FIXED */}
        <Select
          value={formData.productCategory}
          onValueChange={handleSelectChange("productCategory")}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Product Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="clothes">Clothes</SelectItem>
            <SelectItem value="shoes">Shoes</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
          </SelectContent>
        </Select>

        {/* Products sub-categories */}
        <Select
          value={formData.productSubCategory}
          onValueChange={handleSelectChange("productSubCategory")}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Product Sub-Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="bags">Bags</SelectItem>
            <SelectItem value="belts">Belts</SelectItem>
            <SelectItem value="blouses">Blouses</SelectItem>
            <SelectItem value="boots">Boots</SelectItem>
            <SelectItem value="casuals">Casuals</SelectItem>
            <SelectItem value="hats">Hats</SelectItem>
            <SelectItem value="jackets">Jackets</SelectItem>
            <SelectItem value="loafers">Loafers</SelectItem>
            <SelectItem value="long-sleeves">Long-sleeves</SelectItem>
            <SelectItem value="necklacs">Necklaces</SelectItem>
            <SelectItem value="scarfs">Scarfs</SelectItem>
            <SelectItem value="shirts">Shirts</SelectItem>
            <SelectItem value="skirts">Skirts</SelectItem>
            <SelectItem value="sneakers">Sneakers</SelectItem>
            <SelectItem value="trekkers">Trekkers</SelectItem>
            <SelectItem value="trousers">Trousers</SelectItem>
            <SelectItem value="t-shirts">T-shirts</SelectItem>
            <SelectItem value="watches">Watches</SelectItem>
          </SelectContent>
        </Select>

        {/* Product gender options */}
        <Select
          value={formData.productGender}
          onValueChange={handleSelectChange("productGender")}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Product Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="unisex">Unisex</SelectItem>
          </SelectContent>
        </Select>

        {/* Brand name of product */}
        <Input
          type="text"
          id="productBrand"
          name="productBrand"
          value={formData.productBrand}
          onChange={handleInputChange}
          placeholder="Enter product brand"
          className="border rounded-lg p-2 w-full max-w-xs"
        />

        {/* Product sizes */}
        <Select
          value={formData.productSizes}
          onValueChange={handleSelectChange("productSizes")}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Product Sizes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="small">S</SelectItem>
            <SelectItem value="medium">M</SelectItem>
            <SelectItem value="large">L</SelectItem>
            <SelectItem value="x-large">XL</SelectItem>
            <SelectItem value="xx-large">XXL</SelectItem>
          </SelectContent>
        </Select>

        {/* Product quantity */}
        <div className="flex flex-row items-center gap-2">
          <Button
            type="button"
            onClick={handleDecreaseQuantity}
            className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 hover:from-blue-600 hover:via-teal-600 hover:to-green-600 text-white w-[40px] h-[40px] flex items-center justify-center"
          >
            <Minus />
          </Button>
          <Input
            type="number"
            id="productQuantity"
            name="productQuantity"
            value={productQuantity}
            onChange={(e) =>
              setProductQuantity(e.target.value ? parseInt(e.target.value) : 0)
            }
            placeholder="0"
            className="border rounded-lg p-2 w-auto h-[40px] flex items-center justify-center mt-2"
            required
          />
          <Button
            type="button"
            onClick={handleIncreaseQuantity}
            className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 hover:from-blue-600 hover:via-teal-600 hover:to-green-600 text-white w-[40px] h-[40px] flex items-center justify-center"
          >
            <Plus />
          </Button>
        </div>
        <Input type="hidden" id="sku" name="sku" value={sku} />
      </div>

      <Button
        type="submit"
        className="cursor-pointer bg-green-800 hover:bg-teal-600 text-white w-full max-w-xs"
      >
        Create Product
      </Button>
    </form>
  );
};

export default NewProductForm;
