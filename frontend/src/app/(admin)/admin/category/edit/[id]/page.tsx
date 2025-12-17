"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { FiTag, FiLink, FiImage, FiFileText } from "react-icons/fi";
import Link from 'next/link';
import { categoryService, CategoryData, CategoryResponse } from "@/services/category.service";
import { encryptPayload } from "@/utils/encryption";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const [data, setData] = useState({
    categoryName: "",
    slug: "",
    parentCategory: "", // This will be removed from the actual data sent to the server
    shortDesc: "",
    longDesc: "",
    isActive: true,
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null);
  const [existingBanner, setExistingBanner] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch category data on component mount
  useEffect(() => {
    if (id) {
      fetchCategoryData();
    }
  }, [id]);

  const fetchCategoryData = async () => {
    try {
      setFetching(true);
      const response = await categoryService.getCategoryById(id as string);
      
      if (response.outcome && response.data) {
        const category = response.data;
        setData({
          categoryName: category.categoryName,
          slug: category.slug,
          parentCategory: "", // Removed parentCategory since it's not in the interface
          shortDesc: category.shortDesc || "",
          longDesc: category.longDesc || "",
          isActive: category.isActive !== undefined ? category.isActive : true,
        });
        
        // Set existing image paths
        setExistingThumbnail(category.thumbnail || null);
        setExistingBanner(category.banner || null);
      } else {
        toast.error(response.message || "Failed to fetch category data");
        router.push('/admin/category/list');
      }
    } catch (error: any) {
      console.error("Error fetching category:", error);
      toast.error(error.message || "An error occurred while fetching the category");
      router.push('/admin/category/list');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCheckboxChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const handleSubmit = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Filter out parentCategory since it's not in the CategoryData interface
      const { parentCategory, ...filteredData } = data;
      const categoryData: CategoryData = {
        ...filteredData,
      };

      const encryptedPayload = await encryptPayload(categoryData);
      
      let response;
      
      if (encryptedPayload) {
        // For encrypted payloads, we need to send as form data
        const formData = new FormData();
        formData.append('encryptedData', encryptedPayload.data);
        formData.append('iv', encryptedPayload.iv);
        
        // Only include files if they were selected
        if (thumbnail) {
          formData.append('thumbnail', thumbnail);
        }
        if (banner) {
          formData.append('banner', banner);
        }
        
        response = await categoryService.updateCategory(
          id as string,
          formData
        );
      } else {
        // For non-encrypted payloads, send as form data with JSON data
        const formData = new FormData();
        formData.append('data', JSON.stringify(categoryData));
        
        // Only include files if they were selected
        if (thumbnail) {
          formData.append('thumbnail', thumbnail);
        }
        if (banner) {
          formData.append('banner', banner);
        }
        
        response = await categoryService.updateCategory(
          id as string,
          formData
        );
      }
      
      if (response && response.outcome === true) {
        toast.success(response.message || "Category updated successfully!");
        router.push('/admin/category/list');
      } else if (response) {
        toast.error(response.message || "Failed to update category");
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (error: any) {
      console.error("Error updating category:", error);
      toast.error(error.message || "An error occurred while updating the category");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <section className="p-6" style={{ background: "#fff", borderRadius: "10px" }}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Edit Category</h1>
          <Link 
            href="/admin/category/list" 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Categories
          </Link>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6" style={{ background: "#fff", borderRadius: "10px" }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Edit Category</h1>
        <Link 
          href="/admin/category/list" 
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Back to Categories
        </Link>
      </div>

      {/* FORM CONTENT */}
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <div className="space-y-5">
          {/* 3 fields per row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Category Name */}
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <FiTag className="text-[#22A6DD]" /> Category Name
              </label>
              <input
                type="text"
                value={data.categoryName}
                onChange={handleChange("categoryName")}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div>

            {/* Slug */}
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <FiLink className="text-[#22A6DD]" /> Slug (URL)
              </label>
              <input
                type="text"
                value={data.slug}
                onChange={handleChange("slug")}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div>

            {/* Parent Category */}
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <FiTag className="text-[#22A6DD]" /> Parent Category
              </label>
              <input
                type="text"
                value={data.parentCategory}
                onChange={handleChange("parentCategory")}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Status Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={data.isActive}
              onChange={handleCheckboxChange("isActive")}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={loading}
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Short Description */}
            <div >
                <label className="text-gray-700 font-medium flex items-center gap-2">
                <FiFileText className="text-[#22A6DD]" /> Short Description
                </label>
                <textarea
                rows={1}
                value={data.shortDesc}
                onChange={handleChange("shortDesc")}
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
                rows={1}
                value={data.longDesc}
                onChange={handleChange("longDesc")}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150"
                disabled={loading}
                />
            </div>
          </div>

          {/* IMAGE UPLOAD SECTION */}
          <div className="pt-0 ">
            {/* 2 fields per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Thumbnail */}
              <div>
                <label className="text-gray-700 font-medium flex items-center gap-2">
                  <FiImage className="text-[#22A6DD]" /> Category Image (Thumbnail)
                </label>
                
                {/* Display existing image if available */}
                {existingThumbnail && !thumbnail && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Current thumbnail:</p>
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${existingThumbnail}`} 
                      alt="Current thumbnail" 
                      className="w-24 h-24 object-cover rounded border"
                    />
                  </div>
                )}

                <div className="mt-1">
                  <label className="block w-full cursor-pointer">
                    <div className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                      {thumbnail ? thumbnail.name : "Choose File (Leave empty to keep current)"}
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
              </div>

              {/* Banner Image */}
              <div>
                <label className="text-gray-700 font-medium flex items-center gap-2">
                  <FiImage className="text-[#22A6DD]" /> Category Banner Image
                </label>
                
                {/* Display existing image if available */}
                {existingBanner && !banner && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Current banner:</p>
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${existingBanner}`} 
                      alt="Current banner" 
                      className="w-32 h-16 object-cover rounded border"
                    />
                  </div>
                )}

                <div className="mt-1">
                  <label className="block w-full cursor-pointer">
                    <div className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                      {banner ? banner.name : "Choose File (Leave empty to keep current)"}
                    </div>

                    {/* HIDDEN INPUT */}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setBanner(e.target.files?.[0] || null)}
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="mt-6 flex gap-3 justify-center">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-2 rounded-md ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-[#22A6DD] hover:bg-[#1d8ec4] text-white"
          }`}
        >
          {loading ? "Saving..." : "Update Category"}
        </button>

        <Link
          href="/admin/category/list"
          className="px-6 py-2 border border-red-400 text-red-500 rounded-md hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
        >
          Cancel
        </Link>
      </div>
    </section>
  );
}