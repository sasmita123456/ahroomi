"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { FiTag, FiLink, FiFileText, FiPackage, FiArrowLeft, FiImage } from "react-icons/fi";
import Link from 'next/link';
import { productService, ProductData, ProductResponse, CategoryOption } from "@/services/product.service";
import { encryptPayload } from "@/utils/encryption";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [data, setData] = useState({
    productName: "",
    productSlug: "",
    category: "",
    tags: [] as string[],
    shortDescription: "",
    longDescription: "",
    sku: "",
  });

  const [tagsInput, setTagsInput] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);

  // Fetch product and categories on component mount
  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      try {
        // Fetch categories
        setLoadingCategories(true);
        const categoriesResponse = await productService.getAllCategories();
        if (categoriesResponse && categoriesResponse.outcome === true && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
        setLoadingCategories(false);
        
        // Fetch product
        setLoadingProduct(true);
        const productResponse = await productService.getProductById(id as string);
        if (productResponse && productResponse.outcome === true && productResponse.data) {
          const product = productResponse.data;
          setData({
            productName: product.productName || "",
            productSlug: product.productSlug || "",
            category: product.category?._id || "",
            tags: product.tags || [],
            shortDescription: product.shortDescription || "",
            longDescription: product.longDescription || "",
            sku: product.sku || "",
          });
          

        } else if (productResponse) {
          toast.error(productResponse.message || "Failed to fetch product");
        } else {
          toast.error("Unexpected response from server");
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error(error.message || "Failed to fetch data");
      } finally {
        setLoadingCategories(false);
        setLoadingProduct(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagsInput.trim() !== "") {
      const newTags = [...data.tags, tagsInput.trim()];
      setData({ ...data, tags: newTags });
      setTagsInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = [...data.tags];
    newTags.splice(index, 1);
    setData({ ...data, tags: newTags });
  };

  const handleSubmit = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Validation
      if (!data.productName) {
        toast.error("Product Name is required");
        setLoading(false);
        return;
      }
      
      if (!data.productSlug) {
        toast.error("Product Slug is required");
        setLoading(false);
        return;
      }
      
      if (!data.category) {
        toast.error("Category is required");
        setLoading(false);
        return;
      }
      
      if (!data.sku) {
        toast.error("SKU is required");
        setLoading(false);
        return;
      }

      const productData: ProductData = {
        ...data,
      };

      const encryptedPayload = await encryptPayload(productData);

      if (encryptedPayload) {
        const response = await productService.updateProduct(id as string, {
          encryptedData: encryptedPayload.data,
          iv: encryptedPayload.iv
        });

        if (response && response.outcome === true) {
          toast.success(response.message || "Product Updated Successfully!");
          router.push("/admin/product/list");
        } else if (response) {
          toast.error(response.message || "Failed to update product");
        } else {
          toast.error("Unexpected response from server");
        }
      } else {
        const response = await productService.updateProduct(id as string, {
          data: productData
        });

        if (response && response.outcome === true) {
          toast.success(response.message || "Product Updated Successfully!");
          router.push("/admin/product/list");
        } else if (response) {
          toast.error(response.message || "Failed to update product");
        } else {
          toast.error("Unexpected response from server");
        }
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(error.message || "An error occurred while updating the product");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft /> Back
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Edit Product</h1>
          <div></div> {/* Spacer */}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="p-6" style={{ background: "#fff", borderRadius: "10px" }}>
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft /> Back
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">Edit Product</h1>
        <div></div> {/* Spacer */}
      </div>

      {/* FORM CONTENT */}
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <div className="space-y-5">
          {/* Product Name and Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Product Name */}
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <FiTag className="text-[#22A6DD]" /> Product Name *
              </label>
              <input
                type="text"
                value={data.productName}
                onChange={handleChange("productName")}
                placeholder="Enter product name"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div>

            {/* Product Slug */}
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <FiLink className="text-[#22A6DD]" /> Product Slug *
              </label>
              <input
                type="text"
                value={data.productSlug}
                onChange={handleChange("productSlug")}
                placeholder="Enter product slug"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div>
          </div>

          {/* Category and SKU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category */}
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <FiTag className="text-[#22A6DD]" /> Category *
              </label>
              {loadingCategories ? (
                <div className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-gray-500">
                  Loading categories...
                </div>
              ) : (
                <select
                  value={data.category}
                  onChange={(e) => setData({ ...data, category: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
                  disabled={loading}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* SKU */}
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <FiPackage className="text-[#22A6DD]" /> SKU *
              </label>
              <input
                type="text"
                value={data.sku}
                onChange={handleChange("sku")}
                placeholder="Enter product SKU"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-gray-700 font-medium flex items-center gap-2">
              <FiTag className="text-[#22A6DD]" /> Tags
            </label>
            <div className="flex mt-1">
              <input
                type="text"
                value={tagsInput}
                onChange={handleTagsChange}
                placeholder="Enter tags (comma separated)"
                className="flex-grow p-2 border border-gray-300 rounded-l-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-[#22A6DD] hover:bg-[#1d8ec4] text-white px-4 py-2 rounded-r-lg transition-colors"
                disabled={loading}
              >
                Add
              </button>
            </div>
            {/* Display tags */}
            <div className="mt-2 flex flex-wrap gap-2">
              {data.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button 
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="text-blue-800 hover:text-blue-900 font-bold"
                    disabled={loading}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Short Description */}
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <FiFileText className="text-[#22A6DD]" /> Short Description
              </label>
              <textarea
                rows={3}
                value={data.shortDescription}
                onChange={handleChange("shortDescription")}
                placeholder="Enter short description"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div>

            {/* Long Description */}
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <FiFileText className="text-[#22A6DD]" /> Long Description
              </label>
              <textarea
                rows={3}
                value={data.longDescription}
                onChange={handleChange("longDescription")}
                placeholder="Enter long description"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div>
          </div>


        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="mt-6 flex gap-3 justify-center">
        <button
          onClick={() => router.back()}
          disabled={loading}
          className="px-6 py-2 border border-red-400 text-red-500 rounded-md hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-2 rounded-md ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-[#22A6DD] hover:bg-[#1d8ec4] text-white"
          }`}
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </div>
    </section>
  );
}