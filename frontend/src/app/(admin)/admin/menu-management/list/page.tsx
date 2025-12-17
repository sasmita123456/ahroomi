"use client";

import { useEffect, useState, useMemo, useContext } from 'react';
import { menuService, MenuItem } from '@/services/menu.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { ReusableTable } from '@/components/Table';
import { toast } from 'react-toastify';
import { useMenuContext } from '@/contexts/MenuContext';

export default function MenuListPage() {
  const router = useRouter(); // Initialize router
  const { refreshMenus } = useMenuContext();
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await menuService.getAllMenus();
      if (response.outcome) {
        setMenus(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch menus');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort menus based on search term and sort criteria
  const filteredAndSortedMenus = useMemo(() => {
    let result = [...menus];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(menu => 
        menu.name.toLowerCase().includes(term) ||
        menu.link.toLowerCase().includes(term) ||
        (menu.icon && menu.icon.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        let aValue = a[sortBy as keyof MenuItem];
        let bValue = b[sortBy as keyof MenuItem];
        
        // Handle special case for roles array
        if (sortBy === 'roles' && Array.isArray(aValue) && Array.isArray(bValue)) {
          aValue = aValue.join(', ').toLowerCase();
          bValue = bValue.join(', ').toLowerCase();
        }
        
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
    
    return result;
  }, [menus, searchTerm, sortBy, sortOrder]);

  // Paginate the filtered and sorted data
  const paginatedMenus = useMemo(() => {
    const startIndex = pageIndex * pageSize;
    return filteredAndSortedMenus.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedMenus, pageIndex, pageSize]);

  const handleToggleStatus = async (menu: MenuItem, newValue: boolean) => {
    try {
      const response = await menuService.toggleMenuStatus(menu._id);
      if (response.outcome) {
        toast.success(`Menu ${newValue ? 'activated' : 'deactivated'} successfully`);
        fetchMenus(); // Refresh the list
        // Also refresh the sidebar menus
        await refreshMenus();
      } else {
        toast.error(response.message || `Failed to ${newValue ? 'activate' : 'deactivate'} menu`);
      }
    } catch (err) {
      toast.error(`An error occurred while ${newValue ? 'activating' : 'deactivating'} the menu`);
      console.error(err);
    }
  };

  const handleEdit = (menu: MenuItem) => {
    // Use router.push instead of window.location.href to prevent page reload
    router.push(`/admin/menu-management/edit/${menu._id}`);
  };

  // Columns for the reusable table
  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Link',
      accessorKey: 'link',
    },
    {
      header: 'Icon',
      accessorKey: 'icon',
      cell: ({ getValue }: any) => getValue() || '-'
    },
    {
      header: 'Roles',
      accessorKey: 'roles',
      cell: ({ getValue }: any) => (
        <div className="flex space-x-1">
          {getValue().map((role: string) => (
            <span 
              key={role} 
              className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800"
            >
              {role}
            </span>
          ))}
        </div>
      )
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
      header: 'Order',
      accessorKey: 'order',
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Menu Management</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <Link 
          href="/admin/menu-management/new"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add New Menu
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <ReusableTable<MenuItem>
          columns={columns}
          data={paginatedMenus}
          isLoading={loading}
          totalCount={filteredAndSortedMenus.length}
          pageCount={Math.ceil(filteredAndSortedMenus.length / pageSize)}
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
    </div>
  );
}