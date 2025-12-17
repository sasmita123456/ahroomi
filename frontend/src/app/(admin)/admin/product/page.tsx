import Link from 'next/link';

export default function ProductHubPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Product Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <p className="text-gray-600 mb-4">Create a new product with images</p>
          <Link 
            href="/admin/product/new" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Add Product
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">View Products</h2>
          <p className="text-gray-600 mb-4">Manage existing products</p>
          <Link 
            href="/admin/product/list" 
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
}