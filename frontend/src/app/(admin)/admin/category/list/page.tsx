"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ReusableTable } from '@/components/Table';
import { categoryService, CategoryResponse } from '@/services/category.service';
import { encryptPayload } from '@/utils/encryption';
import { useRouter } from 'next/navigation';

interface Category extends CategoryResponse {
  isActive?: boolean;
}

export default function CategoryListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['categories', pageIndex, pageSize, searchTerm, sortBy, sortOrder],
    queryFn: async () => {
      const response = await categoryService.getAllCategories();
      
      let filteredData = response.data || [];
      
      filteredData = filteredData.map(cat => ({
        ...cat,
        isActive: cat.isActive !== undefined ? cat.isActive : true
      }));
      
      if (searchTerm) {
        filteredData = filteredData.filter(cat => 
          cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply sorting
      if (sortBy) {
        filteredData.sort((a, b) => {
          let aValue = a[sortBy as keyof Category];
          let bValue = b[sortBy as keyof Category];
          
          // Handle null/undefined values
          if (aValue == null && bValue == null) return 0;
          if (aValue == null) return sortOrder === 'asc' ? -1 : 1;
          if (bValue == null) return sortOrder === 'asc' ? 1 : -1;
          
          // Handle special cases for different data types
          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
          }
          if (typeof bValue === 'string') {
            bValue = bValue.toLowerCase();
          }
          
          if (aValue < bValue) {
            return sortOrder === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortOrder === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
      
      const totalCount = filteredData.length;
      const pageCount = Math.ceil(totalCount / pageSize);
      const startIndex = pageIndex * pageSize;
      const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);
      
      return {
        categories: paginatedData,
        totalCount,
        pageCount
      };
    },
    placeholderData: (previousData) => previousData,
  });

  const handleEdit = (category: Category) => {
    router.push(`/admin/category/edit/${category._id}`);
  };

  const handleToggleStatus = async (category: Category, newValue: boolean) => {
    try {
      const payload = {
        isActive: newValue
      };
      
      const encryptedPayloadData = await encryptPayload(payload);
      
      if (encryptedPayloadData) {
        const response = await categoryService.updateCategory(category._id, {
          encryptedData: encryptedPayloadData.data,
          iv: encryptedPayloadData.iv
        });
        
        if (response.outcome) {
          toast.success(`Category ${newValue ? 'activated' : 'deactivated'} successfully`);
          queryClient.invalidateQueries({ queryKey: ['categories'] });
        } else {
          toast.error(response.message || `Failed to ${newValue ? 'activate' : 'deactivate'} category`);
        }
      } else {
        const response = await categoryService.updateCategory(category._id, {
          isActive: newValue
        });
        
        if (response.outcome) {
          toast.success(`Category ${newValue ? 'activated' : 'deactivated'} successfully`);
          queryClient.invalidateQueries({ queryKey: ['categories'] });
        } else {
          toast.error(response.message || `Failed to ${newValue ? 'activate' : 'deactivate'} category`);
        }
      }
    } catch (err) {
      toast.error(`An error occurred while ${newValue ? 'activating' : 'deactivating'} the category`);
      console.error(err);
    }
  };

  const columns = [
    {
      header: 'Category Name',
      accessorKey: 'categoryName',
    },
    {
      header: 'Slug',
      accessorKey: 'slug',
    },
    {
      header: 'Thumbnail',
      accessorKey: 'thumbnail',
      cell: ({ row }: any) => {
        const thumbnail = row.original.thumbnail;
        const [imageError, setImageError] = useState(false);
        
        if (!thumbnail) return <span className="text-gray-500">No image</span>;
        
        if (imageError) return <span className="text-gray-500 text-xs">Image not found</span>;
        
        return (
          <div className="flex items-center justify-center">
            <img 
              src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${thumbnail}`} 
              alt="Thumbnail" 
              className="w-12 h-12 object-cover rounded border"
              onError={() => setImageError(true)}
            />
          </div>
        );
      }
    },
    {
      header: 'Banner',
      accessorKey: 'banner',
      cell: ({ row }: any) => {
        const banner = row.original.banner;
        const [imageError, setImageError] = useState(false);
        
        if (!banner) return <span className="text-gray-500">No image</span>;
        
        if (imageError) return <span className="text-gray-500 text-xs">Image not found</span>;
        
        return (
          <div className="flex items-center justify-center">
            <img 
              src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${banner}`} 
              alt="Banner" 
              className="w-16 h-8 object-cover rounded border"
              onError={() => setImageError(true)}
            />
          </div>
        );
      }
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
    },
    {
      header: 'Updated At',
      accessorKey: 'updatedAt',
      cell: ({ getValue }: any) => new Date(getValue()).toLocaleDateString()
    }
  ];

  if (isError) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Category List</h1>
          <Link 
            href="/admin/category" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Categories
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error loading categories: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="p-6" style={{ background: "#fff", borderRadius: "10px" }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Category List</h1>
        <div>
          <Link 
            href="/admin/category/new" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors mr-2"
          >
            Add Category
          </Link>
          <Link 
            href="/admin/category" 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Categories
          </Link>
        </div>
      </div>
      
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <ReusableTable<Category>
          columns={columns}
          data={data?.categories || []}
          isLoading={isLoading}
          totalCount={data?.totalCount || 0}
          pageCount={data?.pageCount || 0}
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
              // Reset to first page when search changes
              setPageIndex(0);
            }
          }}
        />
      </div>
    </section>
  );
}