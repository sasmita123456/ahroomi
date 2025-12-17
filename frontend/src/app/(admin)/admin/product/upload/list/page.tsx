"use client";

import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { FiImage, FiArrowLeft, FiEdit, FiTrash2, FiSave, FiX, FiUpload } from "react-icons/fi";
import Link from 'next/link';
import { productService, ProductResponse } from "@/services/product.service";

interface ImageData {
  id: string;
  thumbnail?: string;
  longImages?: string[]; // Array to hold multiple long images
  alt: string;
  title: string;
  productId: string;
  productName: string;
  sku: string;
  updatedAt?: string;
  images: Array<{thumbnail?: string, longImage?: string, alt?: string, title?: string}>; // Store all images
}

export default function ProductImageListPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all product images on component mount
  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        setLoading(true);
        const response = await productService.getActiveProducts();
        if (response && response.outcome === true && response.data) {
          // Group images by product instead of flattening
          const productImages: ImageData[] = [];
          response.data.forEach(product => {
            if (product.images && product.images.length > 0) {
              // Separate thumbnails and long images
              const thumbnails = product.images.filter(img => img.thumbnail);
              const longImages = product.images.filter(img => img.longImage);
              
              // Create one entry per product with all its images
              productImages.push({
                id: product._id,
                thumbnail: thumbnails.length > 0 ? thumbnails[0].thumbnail : undefined, // Show first thumbnail
                longImages: longImages.map(img => img.longImage!).filter(Boolean), // Array of all long images
                alt: product.images[0]?.alt || "", // Use first image's alt
                title: product.images[0]?.title || "", // Use first image's title
                productId: product._id,
                productName: product.productName,
                sku: product.sku,
                updatedAt: product.updatedAt,
                images: product.images // Store all images for detail views
              });
            }
          });
          setImages(productImages);
        }
      } catch (error: any) {
        console.error("Error fetching product images:", error);
        toast.error(error.message || "Failed to fetch product images");
      } finally {
        setLoading(false);
      }
    };

    fetchProductImages();
  }, []);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleDeleteProductImages = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete all images for this product?")) {
      return;
    }

    try {
      // Validate inputs
      if (!productId) {
        toast.error("Invalid product data");
        return;
      }

      // Update the product with an empty images array
      const response = await productService.updateProduct(productId, {
        images: []
      });

      if (response && response.outcome === true) {
        toast.success("All images deleted successfully!");
        // Update the local state
        setImages(images.filter(img => img.id !== productId));
      } else {
        toast.error(response?.message || "Failed to delete images");
      }
    } catch (error: any) {
      console.error("Error deleting images:", error);
      toast.error(error.message || "An error occurred while deleting the images");
    }
  };

  if (loading) {
    return (
      <section className="p-6" style={{ background: "#fff", borderRadius: "10px" }}>
        <div className="flex justify-between items-center mb-6">
          <Link 
            href="/admin/product" 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft /> Back to Products
          </Link>
          <h1 className="text-2xl font-semibold text-gray-800">Product Image List</h1>
          <div></div>
        </div>
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <p>Loading images...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6" style={{ background: "#fff", borderRadius: "10px" }}>
      <div className="flex justify-between items-center mb-6">
        <Link 
          href="/admin/product" 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft /> Back to Products
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">Product Image List</h1>
        <div></div>
      </div>

      {/* Hidden file input for image uploads - no longer used with dedicated edit page */}
      {/* <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      /> */}

      <div className="bg-white border rounded-lg shadow-sm p-6">
        {images.length === 0 ? (
          <div className="text-center py-8">
            <FiImage className="mx-auto text-gray-400 text-4xl mb-4" />
            <p className="text-gray-500">No product images found</p>
            <Link 
              href="/admin/product/upload" 
              className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Upload Images
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alt Text
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {images.map((image) => (
                  <tr key={image.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{image.productName}</div>
                      <div className="text-sm text-gray-500">SKU: {image.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-2">
                        {/* Thumbnail */}
                        {image.thumbnail && (
                          <div className="relative">
                            <img 
                              src={`${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${image.thumbnail}`} 
                              alt={image.alt || "Thumbnail"} 
                              className="w-16 h-16 object-cover rounded border"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                            <span className="absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-br">T</span>
                          </div>
                        )}
                        
                        {/* Long Images */}
                        {image.longImages && image.longImages.map((longImg, idx) => (
                          <div key={idx} className="relative">
                            <img 
                              src={`${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${longImg}`} 
                              alt={`${image.alt || "Long image"} ${idx + 1}`} 
                              className="w-16 h-16 object-cover rounded border"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                            <span className="absolute bottom-0 left-0 bg-green-500 text-white text-xs px-1 rounded-br">L</span>
                          </div>
                        ))}
                        
                        {/* Placeholder if no images */}
                        {!image.thumbnail && (!image.longImages || image.longImages.length === 0) && (
                          <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center">
                            <FiImage className="text-gray-500" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {image.thumbnail ? "Thumbnail" : image.longImages && image.longImages.length > 0 ? `Long Images (${image.longImages.length})` : "No Images"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={image.alt}>
                        {image.alt || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={image.title}>
                        {image.title || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        image.alt || image.title 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {image.alt || image.title ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(image.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/admin/product/upload/edit?productId=${image.productId}`}
                          className="inline-flex items-center px-2 py-1 border border-blue-300 text-sm font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          title="Edit product images"
                        >
                          <FiEdit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProductImages(image.productId)}
                          className="inline-flex items-center px-2 py-1 border border-red-300 text-sm font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          title="Delete all product images"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}