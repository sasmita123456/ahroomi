"use client";

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { menuService, MenuItem } from '@/services/menu.service';
import { encryptPayload } from '@/utils/encryption';
import Link from 'next/link';
import { useMenuContext } from '@/contexts/MenuContext';
import { toast } from 'react-toastify';

export default function EditMenuPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { refreshMenus } = useMenuContext();
  const { id } = params;
  
  const [formData, setFormData] = useState<Omit<MenuItem, '_id' | 'createdAt' | 'updatedAt'> & { _id?: string }>({
    name: '',
    link: '',
    icon: '',
    parentId: null,
    order: 0,
    isActive: true,
    roles: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [menusLoading, setMenusLoading] = useState(true);

  useEffect(() => {
    if (id) {
      Promise.all([fetchMenu(), fetchAllMenus()]);
    }
  }, [id]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await menuService.getAllMenus();
      if (response.outcome) {
        const menu = response.data.find(m => m._id === id);
        if (menu) {
          setFormData({
            name: menu.name,
            link: menu.link,
            icon: menu.icon || '',
            parentId: menu.parentId,
            order: menu.order,
            isActive: menu.isActive,
            roles: menu.roles
          });
        } else {
          setError('Menu not found');
        }
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch menu');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMenus = async () => {
    try {
      setMenusLoading(true);
      const response = await menuService.getAllMenus();
      if (response.outcome) {
        setMenus(response.data);
      }
    } catch (err) {
      console.error('Error fetching menus:', err);
    } finally {
      setMenusLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRolesChange = (role: 'ADMIN' | 'CMS' | 'USER') => {
    setFormData(prev => {
      const roles = prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role];
      
      return {
        ...prev,
        roles
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate order field
    let orderValue = formData.order;
    if (typeof orderValue === 'string') {
      if (orderValue === '' || orderValue === '-') {
        orderValue = 0;
      } else {
        orderValue = parseInt(orderValue) || 0;
      }
    }
    
    // Ensure order is not negative
    if (orderValue < 0) {
      setError('Order must be a positive number or zero');
      return;
    }
    
    // Validate parentId if provided
    let parentIdValue = null;
    if (formData.parentId) {
      // If it's already an ObjectId string, use it as is
      if (typeof formData.parentId === 'string' && /^[0-9a-fA-F]{24}$/.test(formData.parentId)) {
        parentIdValue = formData.parentId;
      } else if (typeof formData.parentId === 'string') {
        // If it's a string but not an ObjectId, it might be from the select
        parentIdValue = formData.parentId;
      }
    }
    
    if (!formData.name || !formData.link || formData.roles.length === 0) {
      setError('Name, link, and at least one role are required');
      return;
    }
    
    try {
      setSaving(true);
      // Prepare the data for submission
      const submitData = {
        ...formData,
        order: orderValue,
        parentId: parentIdValue // Use validated parentId
      };
      
      // Try to encrypt the payload
      const encryptedPayload = await encryptPayload(submitData);
      
      let response;
      if (encryptedPayload) {
        // Use encrypted submission
        response = await menuService.updateMenuEncrypted(
          id as string,
          encryptedPayload.data,
          encryptedPayload.iv
        );
      } else {
        // Fallback to regular submission
        response = await menuService.updateMenu(id as string, submitData);
      }
      
      if (response.outcome) {
        // Refresh the sidebar menus
        await refreshMenus();
        toast.success('Menu updated successfully');
        router.push('/admin/menu-management/list');
      } else {
        // Show specific error message from backend
        setError(response.message || 'Failed to update menu');
      }
    } catch (err: any) {
      // Provide more detailed error information
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Failed to update menu. Please try again.');
      }
      console.error('Menu update error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Menu</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Menu</h1>
        <Link 
          href="/admin/menu-management/list"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to List
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Menu Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter menu name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link *
              </label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter link (e.g., /admin/dashboard)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter icon class (e.g., MdDashboard)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Menu
              </label>
              {menusLoading ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Loading menus...
                </div>
              ) : (
                <select
                  name="parentId"
                  value={formData.parentId || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None (Top Level Menu)</option>
                  {menus
                    .filter(menu => !menu.parentId && menu._id !== id) // Only show top-level menus as parents, exclude self
                    .map(menu => (
                      <option key={menu._id} value={menu._id}>
                        {menu.name}
                      </option>
                    ))}
                </select>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Select a parent menu for submenus. Only top-level menus are shown as options.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <input
                type="number"
                name="order"
                min="0"
                value={formData.order}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter order number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roles *
              </label>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.roles.includes('ADMIN')}
                    onChange={() => handleRolesChange('ADMIN')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">Admin</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.roles.includes('CMS')}
                    onChange={() => handleRolesChange('CMS')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">CMS</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.roles.includes('USER')}
                    onChange={() => handleRolesChange('USER')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">User</span>
                </label>
              </div>
            </div>

            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => {
                    const checked = (e.target as HTMLInputElement).checked;
                    setFormData(prev => ({
                      ...prev,
                      isActive: checked
                    }));
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">Active</span>
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Link 
              href="/admin/menu-management/list"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}