import Link from 'next/link';

interface SharedDashboardProps {
  userRole: 'ADMIN' | 'CMS';
}

export default function SharedDashboard({ userRole }: SharedDashboardProps) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {userRole === 'ADMIN' ? 'Admin Dashboard' : 'CMS Dashboard'}
      </h1>
      <p className="text-gray-600 mb-8">
        Welcome to your {userRole === 'ADMIN' ? 'Admin' : 'CMS'} Panel.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userRole === 'ADMIN' ? (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              <p className="text-gray-600 mb-4">Manage product categories</p>
              <Link 
                href="/admin/category" 
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors mr-2"
              >
                Manage Categories
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Products</h2>
              <p className="text-gray-600 mb-4">Manage products</p>
              <Link 
                href="/admin/product" 
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors mr-2"
              >
                Manage Products
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Content Management</h2>
              <p className="text-gray-600 mb-4">Manage website content</p>
              <Link 
                href="/cms/posts" 
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors mr-2"
              >
                Manage Posts
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}