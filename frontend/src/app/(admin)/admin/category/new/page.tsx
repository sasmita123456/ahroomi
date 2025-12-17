"use client";

import { useState } from "react";
import { toast } from 'react-toastify';
import { FiTag, FiLink, FiImage, FiFileText } from "react-icons/fi";
import Link from 'next/link';
import { categoryService, CategoryData } from "@/services/category.service";
import { encryptPayload } from "@/utils/encryption";

export default function AddCategoryPage() {
  const [data, setData] = useState({
    categoryName: "",
    slug: "",
    // parentCategory: "",
    shortDesc: "",
    longDesc: "",
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const categoryData: CategoryData = {
        ...data,
      };

      const encryptedPayload = await encryptPayload(categoryData);
      
      
      if (encryptedPayload) {
        const response = await categoryService.addCategoryEncrypted(
          encryptedPayload.data,
          encryptedPayload.iv,
          thumbnail || undefined,
          banner || undefined
        );
      if (response && response.outcome === true) {
        
        toast.success(response.message || "Category Saved Successfully!");
        // Reset form
        setData({
          categoryName: "",
          slug: "",
          // parentCategory: "",
          shortDesc: "",
          longDesc: "",
        });
        setThumbnail(null);
        setBanner(null);
      } else if (response) {
        toast.error(response.message || "Failed to save category");
      } else {
        toast.error("Unexpected response from server");
      }
      } else {
       const response = await categoryService.addCategory(
          categoryData,
          thumbnail || undefined,
          banner || undefined
        );
        if (response && response.outcome === true) {
        
        toast.success(response.message || "Category Saved Successfully!");
        // Reset form
        setData({
          categoryName: "",
          slug: "",
          // parentCategory: "",
          shortDesc: "",
          longDesc: "",
        });
        setThumbnail(null);
        setBanner(null);
      } else if (response) {
        toast.error(response.message || "Failed to save category");
      } else {
        toast.error("Unexpected response from server");
      }
      }
      
      
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast.error(error.message || "An error occurred while saving the category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6" style={{ background: "#fff", borderRadius: "10px" }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Add Category</h1>
        <Link 
          href="/admin/category" 
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Back to Categories
        </Link>
      </div>

      {/* FORM CONTENT */}
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <div className="space-y-5">
          {/* 3 fields per row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            {/* <div>
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
            </div> */}
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

                <div className="mt-1">
                  <label className="block w-full cursor-pointer">
                    <div className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                      {thumbnail ? thumbnail.name : "Choose File"}
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

                <div className="mt-1">
                  <label className="block w-full cursor-pointer">
                    <div className="p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm">
                      {banner ? banner.name : "Choose File"}
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
          onClick={() => history.back()}
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
          {loading ? "Saving..." : "Save Category"}
        </button>

       
      </div>
    </section>
  );
}