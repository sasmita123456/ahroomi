"use client";

import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FiPlus } from "react-icons/fi";
import { ReusableTable } from '@/components/Table';
import { productService, ProductResponse } from "@/services/product.service";
import { encryptPayload } from "@/utils/encryption";
import { useRouter } from 'next/navigation';

interface Product extends ProductResponse {
  isActive?: boolean;
}

export default function ProductListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts();
        if (response && response.outcome === true && response.data) {
          // Map products to ensure isActive is properly set
          const mappedProducts = response.data.map(product => ({
            ...product,
            isActive: product.isActive !== undefined ? product.isActive : true
          }));
          setProducts(mappedProducts);
        }
      } catch (error: any) {
        console.error("Error fetching products:", error);
        toast.error(error.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    router.push(`/admin/product/edit/${product._id}`);
  };

  const handleToggleStatus = async (product: Product, newValue: boolean) => {
    try {
      const payload = {
        isActive: newValue
      };
      
      const encryptedPayloadData = await encryptPayload(payload);
      
      if (encryptedPayloadData) {
        const response = await productService.updateProduct(product._id, {
          encryptedData: encryptedPayloadData.data,
          iv: encryptedPayloadData.iv
        });
        
        if (response.outcome) {
          toast.success(`Product ${newValue ? 'activated' : 'deactivated'} successfully`);
          // Update the product in the state
          setProducts(products.map(p => 
            p._id === product._id ? { ...p, isActive: newValue } : p
          ));
        } else {
          toast.error(response.message || `Failed to ${newValue ? 'activate' : 'deactivate'} product`);
        }
      } else {
        const response = await productService.updateProduct(product._id, {
          isActive: newValue
        });
        
        if (response.outcome) {
          toast.success(`Product ${newValue ? 'activated' : 'deactivated'} successfully`);
          // Update the product in the state
          setProducts(products.map(p => 
            p._id === product._id ? { ...p, isActive: newValue } : p
          ));
        } else {
          toast.error(response.message || `Failed to ${newValue ? 'activate' : 'deactivate'} product`);
        }
      }
    } catch (err) {
      toast.error(`An error occurred while ${newValue ? 'activating' : 'deactivating'} the product`);
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await productService.deleteProduct(id);
      if (response && response.outcome === true) {
        toast.success(response.message || "Product deleted successfully!");
        // Remove the deleted product from the state
        setProducts(products.filter(product => product._id !== id));
      } else if (response) {
        toast.error(response.message || "Failed to delete product");
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error(error.message || "An error occurred while deleting the product");
    } finally {
      setDeletingId(null);
    }
  };

 

  const columns = [
    {
      header: 'Product Name',
      accessorKey: 'productName',
    },
    {
      header: 'Slug',
      accessorKey: 'productSlug',
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: ({ row }: any) => {
        const category = row.original.category;
        return <span>{category?.categoryName || 'N/A'}</span>;
      }
    },

    {
      header: 'SKU',
      accessorKey: 'sku',
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: ({ getValue }: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          getValue() 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {getValue() ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ getValue }: any) => new Date(getValue()).toLocaleDateString()
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Product List</h1>
          <Link 
            href="/admin/product/new" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
          >
            <FiPlus /> Add Product
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Product List</h1>
        <div >
          <Link 
            href="/admin/product/new" 
            className="block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors mr-2"
          >
            <FiPlus /> Add Product
          </Link>
          <Link 
            href="/admin/product" 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow-sm p-6">
        <ReusableTable<Product>
          columns={columns}
          data={products}
          isLoading={loading}
          totalCount={products.length}
          pageCount={Math.ceil(products.length / pageSize)}
          searchable={true}
          sortable={true}
          showActions={true}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          fetchData={({ pageIndex, pageSize, sortBy, sortOrder, search }) => {
            setPageIndex(pageIndex);
            setPageSize(pageSize);
            if (sortBy) {
              setSortBy(sortBy);
              setSortOrder(sortOrder || 'asc');
            }
            if (search !== undefined) {
              setSearchTerm(search);
              setPageIndex(0);
            }
          }}
        />
      </div>
    </div>
  );
}