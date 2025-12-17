"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSave, FiX, FiUpload, FiImage, FiPlus, FiTrash2 } from "react-icons/fi";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { productService, ProductResponse } from "@/services/product.service";

interface EditImageData {
  thumbnail?: File | string;
  longImages: Array<{file?: File, url?: string, isNew: boolean, replaceIndex?: number}>;
  alt: string;
  title: string;
}

export default function ProductImageEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const productId = searchParams.get('productId');
  
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [editData, setEditData] = useState<EditImageData>({
    thumbnail: undefined,
    longImages: [],
    alt: "",
    title: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch product data on component mount
  useEffect(() => {
    if (!productId) {
      toast.error("Missing product ID");
      router.push('/admin/product/upload/list');
      return;
    }
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(productId);
        if (response && response.outcome === true && response.data) {
          setProduct(response.data);
          
          // Initialize edit data with existing images
          const productImages = response.data.images || [];
          const thumbnails = productImages.filter(img => img.thumbnail);
          const longImages = productImages.filter(img => img.longImage);
          
          setEditData({
            thumbnail: thumbnails.length > 0 ? thumbnails[0].thumbnail : undefined,
            longImages: longImages.map((img, index) => ({
              url: img.longImage,
              isNew: false,
              replaceIndex: index // Track the original index for replacement
            })),
            alt: productImages[0]?.alt || "",
            title: productImages[0]?.title || ""
          });
        } else {
          toast.error(response?.message || "Failed to fetch product");
          router.push('/admin/product/upload/list');
        }
      } catch (error: any) {
        console.error("Error fetching product:", error);
        toast.error(error.message || "Failed to fetch product");
        router.push('/admin/product/upload/list');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditData({...editData, thumbnail: e.target.files[0]});
    }
  };

  const handleLongImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newLongImages = files.map(file => ({
        file: file,
        isNew: true
      }));
      
      setEditData({
        ...editData, 
        longImages: [...editData.longImages, ...newLongImages]
      });
    }
  };

  const removeLongImage = (index: number) => {
    const newLongImages = [...editData.longImages];
    newLongImages.splice(index, 1);
    setEditData({...editData, longImages: newLongImages});
  };

  const handleSave = async () => {
    if (!productId) return;
    
    try {
      setSaving(true);
      
      // Prepare form data
      const formData = new FormData();
      
      // Add thumbnail if present and it's a new file
      if (editData.thumbnail && editData.thumbnail instanceof File) {
        formData.append('thumbnail', editData.thumbnail);
        formData.append('thumbnail_alt', editData.alt);
        formData.append('thumbnail_title', editData.title);
      }
      
      // Handle long images - send each new file with its replacement index
      editData.longImages.forEach((imgObj) => {
        if (imgObj.isNew && imgObj.file) {
          formData.append('longImage', imgObj.file);
          // If this is replacing an existing image, send the replace index
          if (imgObj.replaceIndex !== undefined) {
            formData.append('replaceLongImageIndex', imgObj.replaceIndex.toString());
          }
        }
      });
      
      // Add alt and title for long images if there are new ones
      if (editData.longImages.some(img => img.isNew && img.file)) {
        formData.append('longImage_alt', editData.alt);
        formData.append('longImage_title', editData.title);
      }
      
      const response = await productService.updateProduct(productId, formData);
      
      if (response && response.outcome === true) {
        toast.success("Images updated successfully!");
        router.push('/admin/product/upload/list');
      } else {
        toast.error(response?.message || "Failed to update images");
      }
    } catch (error: any) {
      console.error("Error updating images:", error);
      toast.error(error.message || "An error occurred while updating the images");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/product/upload/list');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/admin/product/upload/list" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <FiArrowLeft className="mr-2" />
          Back to Image List
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product Images</h1>
        <p className="text-gray-600 mt-2">
          Product: {product?.productName} | SKU: {product?.sku}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Images Preview */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Current Images</h2>
            
            {/* Thumbnail Preview */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Thumbnail</h3>
              <div className="flex justify-center">
                {editData.thumbnail ? (
                  typeof editData.thumbnail === 'string' ? (
                    <img 
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${editData.thumbnail}`} 
                      alt="Thumbnail" 
                      className="max-w-full h-auto max-h-48 object-contain rounded border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.png';
                      }}
                    />
                  ) : (
                    <img 
                      src={URL.createObjectURL(editData.thumbnail)} 
                      alt="New thumbnail" 
                      className="max-w-full h-auto max-h-48 object-contain rounded border"
                    />
                  )
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 flex items-center justify-center">
                    <FiImage className="text-gray-500 text-2xl" />
                  </div>
                )}
              </div>
              
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Replace Thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>
            
            {/* Long Images Preview */}
            <div>
              <h3 className="text-md font-medium mb-2">Long Images ({editData.longImages.length})</h3>
              <div className="grid grid-cols-2 gap-2">
                {editData.longImages.map((imgObj, index) => (
                  <div key={index} className="relative">
                    {imgObj.isNew && imgObj.file ? (
                      <div className="relative">
                        <img 
                          src={URL.createObjectURL(imgObj.file)} 
                          alt={`New long image ${index + 1}`} 
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeLongImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          title="Remove image"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    ) : imgObj.url ? (
                      <div className="relative">
                        <img 
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${imgObj.url}`} 
                          alt={`Long image ${index + 1}`} 
                          className="w-full h-24 object-cover rounded border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.png';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <label className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer text-xs">
                            Replace
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const newLongImages = [...editData.longImages];
                                  newLongImages[index] = {
                                    file: e.target.files[0],
                                    isNew: true,
                                    replaceIndex: imgObj.replaceIndex
                                  };
                                  setEditData({...editData, longImages: newLongImages});
                                }
                              }}
                            />
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLongImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          title="Remove image"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-24 bg-gray-200 rounded border flex items-center justify-center">
                        <FiImage className="text-gray-500" />
                      </div>
                    )}
                  </div>
                ))}

                {editData.longImages.length === 0 && (
                  <div className="col-span-2 text-center py-4 text-gray-500">
                    No long images uploaded
                  </div>
                )}
              </div>
              
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add More Long Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleLongImagesChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Image Details</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text (applies to all images)
                </label>
                <input
                  type="text"
                  id="alt"
                  value={editData.alt}
                  onChange={(e) => setEditData({...editData, alt: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter alt text"
                />
              </div>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title (applies to all images)
                </label>
                <input
                  type="text"
                  id="title"
                  value={editData.title}
                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter title"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-6">
                <h3 className="text-sm font-medium text-blue-800 mb-1">Note</h3>
                <p className="text-xs text-blue-700">
                  Changes will apply to all images for this product. You can replace the thumbnail, 
                  add or remove long images, and update alt/text for all images at once.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="-ml-1 mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}