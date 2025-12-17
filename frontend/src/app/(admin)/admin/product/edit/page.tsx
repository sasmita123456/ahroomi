"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function EditProductPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the product list page since this route shouldn't be accessed directly
    router.replace('/admin/product/list');
  }, [router]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
           Back
        </button>
        <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
        <div></div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
