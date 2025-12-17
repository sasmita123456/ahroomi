"use client";

import Link from 'next/link';

export default function MenuManagementPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Menu Management</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Menu List</h2>
            <p className="text-gray-600 mb-4">View and manage all menu items</p>
            <Link 
              href="/admin/menu-management/list"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              View Menu List
            </Link>
          </div>
          
          <div className="border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Add New Menu</h2>
            <p className="text-gray-600 mb-4">Create a new menu item</p>
            <Link 
              href="/admin/menu-management/new"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Menu Item
            </Link>
          </div>
          
          <div className="border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Menu Structure</h2>
            <p className="text-gray-600 mb-4">Organize menu hierarchy</p>
            <Link 
              href="/admin/menu-management/list"
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Organize Menus
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}