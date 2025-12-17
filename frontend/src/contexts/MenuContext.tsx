"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { menuService, MenuItem } from '@/services/menu.service';

interface MenuContextType {
  menus: Record<'ADMIN' | 'CMS' | 'USER', MenuItem[]>;
  fetchMenus: (role: 'ADMIN' | 'CMS' | 'USER') => Promise<void>;
  refreshMenus: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menus, setMenus] = useState<Record<'ADMIN' | 'CMS' | 'USER', MenuItem[]>>({
    ADMIN: [],
    CMS: [],
    USER: []
  });

  const fetchMenus = useCallback(async (role: 'ADMIN' | 'CMS' | 'USER') => {
    try {
      const response = await menuService.getMenusByRole(role);
      if (response.outcome) {
        setMenus(prev => ({
          ...prev,
          [role]: response.data
        }));
      }
    } catch (error) {
      console.error(`Error fetching ${role} menus:`, error);
    }
  }, []);

  const refreshMenus = useCallback(async () => {
    // Refresh all menu roles
    await Promise.all([
      fetchMenus('ADMIN'),
      fetchMenus('CMS'),
      fetchMenus('USER')
    ]);
  }, [fetchMenus]);

  return (
    <MenuContext.Provider value={{ menus, fetchMenus, refreshMenus }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
}