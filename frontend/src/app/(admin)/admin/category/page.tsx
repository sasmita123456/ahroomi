import Link from 'next/link';

export default function CategoryHubPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
          <p className="text-gray-600 mb-4">Create a new product category</p>
          <Link 
            href="/admin/category/new" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Add Category
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">View Categories</h2>
          <p className="text-gray-600 mb-4">Manage existing categories</p>
          <Link 
            href="/admin/category/list" 
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            View Categories
          </Link>
        </div>
      </div>
    </div>
  );
}