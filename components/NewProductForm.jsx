"use client";

import { createProductWithImage } from "@/actions/products/createProductsWithImages";
import { Minus, Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

const Label = ({ htmlFor, className, children }) => (
  <label htmlFor={htmlFor} className={className}>
    {children}
  </label>
);

const Input = ({ type, ref, className, ...props }) => (
  <input type={type} ref={ref} className={className} {...props} />
);

const Textarea = ({ className, ...props }) => (
  <textarea className={className} {...props} />
);

const Button = ({ type, onClick, className, children, ...props }) => (
  <button type={type} onClick={onClick} className={className} {...props}>
    {children}
  </button>
);

// Simple Select components
const Select = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (val) => {
    onValueChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <SelectTrigger onClick={() => setIsOpen(!isOpen)} value={value} />
      {isOpen && (
        <SelectContent>
          {React.Children.map(children, (child) =>
            React.cloneElement(child, { onSelect: handleSelect })
          )}
        </SelectContent>
      )}
    </div>
  );
};

const SelectTrigger = ({ onClick, value, className = "w-full max-w-xs" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`${className} bg-white border border-gray-300 rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500`}
  >
    <SelectValue value={value || "Please select an option"} />
  </button>
);

const SelectValue = ({ placeholder = "Select option...", value }) => (
  <span>{value === "none" ? placeholder : value}</span>
);

const SelectContent = ({ children }) => (
  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-36 overflow-y-auto">
    {children}
  </div>
);

const SelectItem = ({ value, children, onSelect }) => (
  <div
    onClick={() => onSelect(value)}
    className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
  >
    {children}
  </div>
);

const NumericFormat = ({
  className,
  value,
  onChange,
  placeholder,
  ...props
}) => (
  <input
    type="text"
    className={className}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    {...props}
  />
);

const initialFormData = {
  productName: "",
  productGender: "",
  productDescription: "",
  productBrand: "",
  productSize: "",
  productPrice: "",
  productQuantity: 0,
  productCategory: "",
  productSubCategory: "",
};

export default function ProductForm() {
  const [formData, setFormData] = useState(initialFormData);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const sku =
    formData.productSubCategory +
    "-" +
    formData.productGender +
    "-" +
    formData.productSize;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleIncreaseQuantity = () => {
    setFormData((prev) => ({
      ...prev,
      productQuantity: prev.productQuantity + 1,
    }));
  };

  const handleDecreaseQuantity = () => {
    setFormData((prev) => ({
      ...prev,
      productQuantity: Math.max(0, prev.productQuantity - 1),
    }));
  };

  const handleSubmit = async (e) => {
    if (!e.target.checkValidity()) {
      return; // Don't prevent default, let browser show validation
    }

    e.preventDefault();

    // Destructure the formData state values
    const {
      productName,
      productGender,
      productDescription,
      productBrand,
      productSize,
      productPrice,
      productQuantity,
      productCategory,
      productSubCategory,
    } = formData;

    // Validate content of fields prior to submit
    if (
      !productName.trim() ||
      !productGender.trim() ||
      !productDescription.trim() ||
      !productBrand.trim() ||
      !productSize ||
      !productPrice.trim() ||
      productQuantity <= 0 ||
      !productCategory ||
      !productSubCategory
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      formData.productQuantity = productQuantity;
      formData.isActive = "true";
      formData.productSku = sku;
      formData.file = selectedFile;

      const result = await createProductWithImage(formData);

      if (!result.success) throw new Error(result.error || "Unknown error");

      result.success
        ? toast.success("Product created successfully")
        : toast.error(
            `Error creating product: ${result.error || "Unknown error"}`
          );

      setFormData(initialFormData);
      fileInputRef.current.value = null;

      return { result: result.success, data: result.data, error: result.error };
    } catch (error) {
      toast.error(`Error creating product: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 px-8 py-6">
          <h1 className="uppercase text-2xl font-bold text-white tracking-wide">
            New Product
          </h1>
          <p className="text-blue-100 mt-1">
            Fill in the details below to create your product
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* Upload single product image */}
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
            <Label
              htmlFor="image"
              className="block mb-3 text-lg font-semibold text-gray-700"
            >
              Upload Product Image
            </Label>
            <Input
              type="file"
              ref={fileInputRef}
              name="productImage"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Product name */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </Label>
                <Input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Product description */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Description
                </Label>
                <Textarea
                  id="productDescription"
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  required
                />
              </div>

              {/* Product categories */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Category
                </Label>
                <Select
                  value={formData.productCategory}
                  onValueChange={handleSelectChange("productCategory")}
                >
                  <SelectItem value="clothes">Clothes</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </Select>
              </div>

              {/* Products sub-categories */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Sub-Category
                </Label>
                <Select
                  value={formData.productSubCategory}
                  onValueChange={handleSelectChange("productSubCategory")}
                >
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
                </Select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Product gender options */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Gender
                </Label>
                <Select
                  value={formData.productGender}
                  onValueChange={handleSelectChange("productGender")}
                >
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="unisex">Unisex</SelectItem>
                </Select>
              </div>

              {/* Brand name of product */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Brand
                </Label>
                <Input
                  type="text"
                  id="productBrand"
                  name="productBrand"
                  value={formData.productBrand}
                  onChange={handleInputChange}
                  placeholder="Enter product brand"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Product sizes */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Sizes
                </Label>
                <Select
                  value={formData.productSize}
                  onValueChange={handleSelectChange("productSize")}
                >
                  <SelectItem value="small">S</SelectItem>
                  <SelectItem value="medium">M</SelectItem>
                  <SelectItem value="large">L</SelectItem>
                  <SelectItem value="x-large">XL</SelectItem>
                  <SelectItem value="xx-large">XXL</SelectItem>
                </Select>
              </div>

              {/* Product quantity */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Quantity
                </Label>
                <div className="flex items-center gap-3 justify-center bg-gray-50 rounded-lg p-4">
                  <Button
                    type="button"
                    onClick={handleDecreaseQuantity}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                  >
                    <Minus size={16} />
                  </Button>
                  <div className="bg-white border-2 border-gray-300 rounded-lg px-6 py-2 min-w-[80px] text-center">
                    <span className="text-xl font-bold text-gray-800">
                      {formData.productQuantity}
                    </span>
                  </div>
                  <Button
                    type="button"
                    onClick={handleIncreaseQuantity}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {/* Product price */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Price
                </Label>
                <NumericFormat
                  name="productPrice"
                  value={formData.productPrice}
                  onChange={handleInputChange}
                  placeholder="$0.00"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg font-semibold"
                  required
                />
              </div>
            </div>
          </div>

          <Input type="hidden" id="sku" name="sku" value={sku} />

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              onClick={handleSubmit}
              className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Create Product
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
