"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FiArrowLeft, FiTag, FiLink, FiFileText, FiPackage, FiImage } from "react-icons/fi";
import { productService, ProductResponse } from "@/services/product.service";

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch product on component mount
  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(id as string);
        if (response && response.outcome === true && response.data) {
          setProduct(response.data);
        } else if (response) {
          toast.error(response.message || "Failed to fetch product");
        } else {
          toast.error("Unexpected response from server");
        }
      } catch (error: any) {
        console.error("Error fetching product:", error);
        toast.error(error.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft /> Back
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">View Product</h1>
          <div></div> {/* Spacer */}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft /> Back
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">View Product</h1>
          <div></div> {/* Spacer */}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">Product not found.</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft /> Back
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">View Product</h1>
        <Link 
          href={`/admin/product/edit/${product._id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Edit Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {/* Product Header */}
          <div className="border-b pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">{product.productName}</h2>
            <p className="text-gray-600">{product.productSlug}</p>
            <div className="mt-2">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                product.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiTag className="text-[#22A6DD]" /> Category
                  </label>
                  <p className="mt-1 text-gray-900">
                    {product.category?.categoryName || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiPackage className="text-[#22A6DD]" /> SKU
                  </label>
                  <p className="mt-1 text-gray-900">{product.sku}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiTag className="text-[#22A6DD]" /> Tags
                  </label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {product.tags && product.tags.length > 0 ? (
                      product.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No tags</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiFileText className="text-[#22A6DD]" /> Short Description
                  </label>
                  <p className="mt-1 text-gray-900">
                    {product.shortDescription || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiFileText className="text-[#22A6DD]" /> Long Description
                  </label>
                  <p className="mt-1 text-gray-900">
                    {product.longDescription || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Images</h3>
              
              <div className="space-y-6">
                {product.images && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Thumbnail</label>
                          {image.thumbnail ? (
                            <div className="mt-2">
                              <img 
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}${image.thumbnail}`} 
                                alt={image.alt || 'Product thumbnail'} 
                                className="w-full h-32 object-cover rounded"
                              />
                              <p className="mt-1 text-xs text-gray-600">{image.title || 'No title'}</p>
                            </div>
                          ) : (
                            <p className="mt-1 text-gray-500">No thumbnail</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500">Long Image</label>
                          {image.longImage ? (
                            <div className="mt-2">
                              <img 
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}${image.longImage}`} 
                                alt={image.alt || 'Product long image'} 
                                className="w-full h-32 object-cover rounded"
                              />
                              <p className="mt-1 text-xs text-gray-600">{image.title || 'No title'}</p>
                            </div>
                          ) : (
                            <p className="mt-1 text-gray-500">No long image</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <label className="text-sm font-medium text-gray-500">Alt Text</label>
                        <p className="text-sm text-gray-900">{image.alt || 'N/A'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No images uploaded</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Metadata */}
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="text-gray-900">
                  {new Date(product.createdAt).toLocaleDateString()}{' '}
                  {new Date(product.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-gray-900">
                  {new Date(product.updatedAt).toLocaleDateString()}{' '}
                  {new Date(product.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}