"use client";

import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { FiImage, FiArrowLeft } from "react-icons/fi";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { productService, ProductResponse } from "@/services/product.service";

export default function UploadProductImagePage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [longImages, setLongImages] = useState<File[]>([]);
  const [thumbnailAlt, setThumbnailAlt] = useState("");
  const [thumbnailTitle, setThumbnailTitle] = useState("");
  const [longImagesAlt, setLongImagesAlt] = useState("");
  const [longImagesTitle, setLongImagesTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await productService.getActiveProducts();
        if (response && response.outcome === true && response.data) {
          setProducts(response.data);
          
          // Check if a product ID was passed in the query parameters
          const productIdFromQuery = searchParams.get('id');
          if (productIdFromQuery) {
            // Verify that the product exists in our list
            const productExists = response.data.some(product => product._id === productIdFromQuery);
            if (productExists) {
              setSelectedProductId(productIdFromQuery);
            }
          }
        }
      } catch (error: any) {
        console.error("Error fetching products:", error);
        toast.error(error.message || "Failed to fetch products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!selectedProductId) {
        toast.error("Please select a product");
        setLoading(false);
        return;
      }
      
      // Upload images to the product
      const response = await productService.uploadProductImages(
        selectedProductId,
        thumbnail || undefined,
        longImages.length > 0 ? longImages : undefined,
        thumbnailAlt,
        thumbnailTitle,
        longImagesAlt,
        longImagesTitle
      );
      
      if (response && response.outcome === true) {
        toast.success(response.message || "Images uploaded successfully!");
        
        // Reset form
        setSelectedProductId("");
        setThumbnail(null);
        setLongImages([]);
        setThumbnailAlt("");
        setThumbnailTitle("");
        setLongImagesAlt("");
        setLongImagesTitle("");
      } else if (response) {
        toast.error(response.message || "Failed to upload images");
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (error: any) {
      console.error("Error uploading images:", error);
      toast.error(error.message || "An error occurred while uploading images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6" style={{ background: "#fff", borderRadius: "10px" }}>
      <div className="flex justify-between items-center mb-6">
        <Link 
          href="/admin/product" 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft /> Back to Products
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">Upload Product Images</h1>
        <div></div> {/* Spacer */}
      </div>

      {/* FORM CONTENT */}
      <div className="bg-white border rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Product ID */}
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <FiImage className="text-[#22A6DD]" /> Select Product *
              </label>
              {loadingProducts ? (
                <div className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-gray-500">
                  Loading products...
                </div>
              ) : (
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
                  disabled={loading}
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.productName} (SKU: {product.sku})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* IMAGE UPLOAD SECTION */}
            <div className="pt-0">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Product Images</h2>
              
              {/* Thumbnail and Long Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Thumbnail */}
                <div>
                  <label className="text-gray-700 font-medium flex items-center gap-2">
                    <FiImage className="text-[#22A6DD]" /> Thumbnail Image
                  </label>

                  <div className="mt-1">
                    <label className="block w-full cursor-pointer">
                      <div className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                        {thumbnail ? thumbnail.name : "Choose Thumbnail"}
                      </div>

                      {/* HIDDEN INPUT */}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                        disabled={loading}
                      />
                    </label>
                  </div>

                  {/* Alt and Title for Thumbnail */}
                  <div className="mt-2 space-y-2">
                    <input
                      type="text"
                      value={thumbnailAlt}
                      onChange={(e) => setThumbnailAlt(e.target.value)}
                      placeholder="Thumbnail Alt Text"
                      className="w-full p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
                      disabled={loading}
                    />
                    <input
                      type="text"
                      value={thumbnailTitle}
                      onChange={(e) => setThumbnailTitle(e.target.value)}
                      placeholder="Thumbnail Title"
                      className="w-full p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Long Images */}
                <div>
                  <label className="text-gray-700 font-medium flex items-center gap-2">
                    <FiImage className="text-[#22A6DD]" /> Long Images (Multiple)
                  </label>

                  <div className="mt-1">
                    <label className="block w-full cursor-pointer">
                      <div className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                        {longImages.length > 0 
                          ? `${longImages.length} file(s) selected` 
                          : "Choose Long Images (Multiple)"}
                      </div>

                      {/* HIDDEN INPUT - Allow multiple files */}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            const filesArray = Array.from(e.target.files);
                            setLongImages(filesArray);
                          }
                        }}
                        disabled={loading}
                      />
                    </label>
                  </div>

                  {/* Alt and Title for Long Images */}
                  <div className="mt-2 space-y-2">
                    <input
                      type="text"
                      value={longImagesAlt}
                      onChange={(e) => setLongImagesAlt(e.target.value)}
                      placeholder="Long Images Alt Text (applies to all)"
                      className="w-full p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
                      disabled={loading}
                    />
                    <input
                      type="text"
                      value={longImagesTitle}
                      onChange={(e) => setLongImagesTitle(e.target.value)}
                      placeholder="Long Images Title (applies to all)"
                      className="w-full p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
                      disabled={loading}
                    />
                  </div>
                  
                  {/* Display selected files */}
                  {longImages.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Selected files:</p>
                      <ul className="text-xs text-gray-700 list-disc pl-5 mt-1 max-h-20 overflow-y-auto">
                        {longImages.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="mt-6 flex gap-3 justify-center">
            <Link
              href="/admin/product"
              className="px-6 py-2 border border-gray-400 text-gray-500 rounded-md hover:bg-gray-50 hover:text-gray-700"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[#22A6DD] hover:bg-[#1d8ec4] text-white"
              }`}
            >
              {loading ? "Uploading..." : "Upload Images"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}