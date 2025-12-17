"use client";

import { FC, useEffect, useState, useContext } from "react";
import {
  MdDashboard,
  MdCategory,
  MdOutlinePriceChange,
  MdInventory,
  MdCampaign,
  MdReport,
  MdInput,
  MdPeopleAlt,
  MdLocalShipping,
  MdPayment,
  MdSettings,
  MdShoppingCart,
  MdAssessment,
  MdReviews,
  MdLocationOn,
  MdInfo,
  MdImage,
  MdCollections,
  MdBusiness,
  MdMenu,
  MdExpandMore,
  MdExpandLess
} from "react-icons/md";
import { FaBoxes, FaPalette, FaTags, FaPercent } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { menuService, MenuItem } from "@/services/menu.service";
import { useMenuContext } from "@/contexts/MenuContext";

interface SharedSidebarProps {
  isOpen: boolean;
  toggle: () => void;
  userRole: 'ADMIN' | 'CMS';
}

// Map icon names to actual components
const iconMap: Record<string, React.ElementType> = {
  MdDashboard,
  MdCategory,
  MdOutlinePriceChange,
  MdInventory,
  MdCampaign,
  MdReport,
  MdInput,
  MdPeopleAlt,
  MdLocalShipping,
  MdPayment,
  MdSettings,
  MdShoppingCart,
  MdAssessment,
  MdReviews,
  MdLocationOn,
  MdInfo,
  MdImage,
  MdCollections,
  MdBusiness,
  MdMenu,
  FaBoxes,
  FaPalette,
  FaTags,
  FaPercent
};

const SharedSidebar: FC<SharedSidebarProps> = ({ isOpen, toggle, userRole }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { menus, fetchMenus } = useMenuContext();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Fetch menu items based on user role
  useEffect(() => {
    fetchMenus(userRole);
  }, [userRole, fetchMenus]);

  // Update expanded items when menus change
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    (menus[userRole] || []).forEach(item => {
      if (item.children && item.children.length > 0) {
        // Expand by default if current path is under this menu item
        initialExpanded[item._id] = isPathUnderMenu(item, pathname);
      }
    });
    setExpandedItems(initialExpanded);
  }, [menus, userRole, pathname]);

  // Check if current path is under a menu item or its children
  const isPathUnderMenu = (menu: MenuItem, currentPath: string): boolean => {
    // Check if current path matches this menu item
    if (currentPath === menu.link) {
      return true;
    }
    
    // Check if current path matches any child menu items
    if (menu.children && menu.children.length > 0) {
      return menu.children.some(child => isPathUnderMenu(child, currentPath));
    }
    
    return false;
  };

  // Toggle expanded state for a menu item
  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Handle submenu click - navigate to parent menu if it has a link
  const handleSubmenuClick = (parentMenu: MenuItem, submenu: MenuItem) => {
    // If parent menu has a link, navigate to it
    if (parentMenu.link && parentMenu.link !== '#') {
      router.push(parentMenu.link);
    } else {
      // Otherwise, just expand the parent menu
      setExpandedItems(prev => ({
        ...prev,
        [parentMenu._id]: true
      }));
    }
  };

  // Get static menu items as fallback
  const getStaticMenuItems = (role: 'ADMIN' | 'CMS'): MenuItem[] => {
    if (role === 'ADMIN') {
      return [
        {
          _id: 'dashboard',
          name: 'Dashboard',
          link: '/admin/dashboard',
          icon: 'MdDashboard',
          parentId: null,
          order: 1,
          isActive: true,
          roles: ['ADMIN'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'menu-management',
          name: 'Menu Management',
          link: '/admin/menu-management/list',
          icon: 'MdMenu',
          parentId: null,
          order: 13,
          isActive: true,
          roles: ['ADMIN'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    } else {
      return [
        {
          _id: 'dashboard',
          name: 'Dashboard',
          link: '/cms/dashboard',
          icon: 'MdDashboard',
          parentId: null,
          order: 1,
          isActive: true,
          roles: ['CMS'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
  };

  // Render a single menu item
  const renderMenuItem = (item: MenuItem) => {
    const isActive = isPathUnderMenu(item, pathname);
    const IconComponent = item.icon && iconMap[item.icon] ? iconMap[item.icon] : MdCategory;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item._id];

    return (
      <div key={item._id}>
        {hasChildren ? (
          // Menu item with children (dropdown)
          <div
            className={`flex items-center gap-3 p-3 rounded-lg border shadow-sm transition-all duration-200 cursor-pointer
              ${isActive
                ? "bg-green-100 border-green-400 shadow-md"
                : "bg-white hover:bg-gray-100"
              }
            `}
            style={{
              borderLeft: isActive ? "4px solid #84CE2F" : "4px solid transparent",
            }}
            onClick={() => toggleExpand(item._id)}
          >
            {/* ICON */}
            <IconComponent
              className={`text-2xl transition-colors duration-200 ${
                isActive ? "text-green-600" : ""
              }`}
              style={{ color: isActive ? "#84CE2F" : "#84CE2F" }}
            />

            {/* NAME */}
            {isOpen && (
              <span
                className={`font-medium flex-grow ${
                  isActive ? "text-green-800 font-semibold" : "text-gray-700"
                }`}
              >
                {item.name}
              </span>
            )}

            {/* EXPAND/COLLAPSE ICON */}
            {isOpen && hasChildren && (
              <span>
                {isExpanded ? (
                  <MdExpandLess className="text-gray-500" />
                ) : (
                  <MdExpandMore className="text-gray-500" />
                )}
              </span>
            )}
          </div>
        ) : (
          // Menu item without children (direct link)
          <Link
            href={item.link}
            className={`flex items-center gap-3 p-3 rounded-lg border shadow-sm transition-all duration-200
              ${isActive
                ? "bg-green-100 border-green-400 shadow-md"
                : "bg-white hover:bg-gray-100"
              }
            `}
            style={{
              borderLeft: isActive ? "4px solid #84CE2F" : "4px solid transparent",
            }}
          >
            {/* ICON */}
            <IconComponent
              className={`text-2xl transition-colors duration-200 ${
                isActive ? "text-green-600" : ""
              }`}
              style={{ color: isActive ? "#84CE2F" : "#84CE2F" }}
            />

            {/* NAME */}
            {isOpen && (
              <span
                className={`font-medium flex-grow ${
                  isActive ? "text-green-800 font-semibold" : "text-gray-700"
                }`}
              >
                {item.name}
              </span>
            )}
          </Link>
        )}

        {/* SUBMENU ITEMS */}
        {isOpen && hasChildren && isExpanded && (
          <div className="ml-8 mt-2 space-y-1">
            {item.children!.map((subItem) => {
              const isSubActive = pathname === subItem.link;
              return (
                <div
                  key={subItem._id}
                  className={`block py-2 px-3 rounded transition-colors cursor-pointer ${
                    isSubActive
                      ? "bg-green-100 text-green-800 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => handleSubmenuClick(item, subItem)}
                >
                  {subItem.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`h-full bg-white shadow-xl border-r transition-all duration-300 flex flex-col
        ${isOpen ? "w-64" : "w-20"}
      `}
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-between px-4 h-16 border-b"
        style={{ backgroundColor: "#22A6DD" }}
      >
        <span className="text-lg font-bold text-white tracking-wide">
          {isOpen ? (userRole === 'ADMIN' ? "Admin Panel" : "CMS Panel") : (userRole === 'ADMIN' ? "AP" : "CP")}
        </span>

        <button onClick={toggle} className="text-white text-xl">
          {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>

      {/* MENU LIST */}
      <nav className="p-3 overflow-y-auto h-[calc(100%-4rem)] space-y-2">
        {(menus[userRole] || []).map(renderMenuItem)}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto p-4 text-center text-xs text-gray-500">
        {isOpen && `© 2025 ${userRole === 'ADMIN' ? "Admin" : "CMS"} Panel`}
      </div>
    </aside>
  );
};

export default SharedSidebar;