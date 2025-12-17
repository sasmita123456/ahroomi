"use client";

import Link from 'next/link';
import { FiUpload, FiList, FiArrowLeft } from "react-icons/fi";

export default function ProductUploadMainPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Link 
          href="/admin/product" 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft /> Back to Products
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">Product Image Management</h1>
        <div></div> {/* Spacer */}
      </div>

      <div className="bg-white border rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Upload Card */}
          <Link 
            href="/admin/product/upload/add"
            className="block border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FiUpload className="text-blue-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Add Product Images</h2>
                <p className="text-gray-600 mt-1">Upload new images for existing products</p>
              </div>
            </div>
          </Link>

          {/* List Upload Card */}
          <Link 
            href="/admin/product/upload/list"
            className="block border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FiList className="text-green-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Manage Product Images</h2>
                <p className="text-gray-600 mt-1">View and edit existing product images</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}