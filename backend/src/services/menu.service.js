const Menu = require("../models/Menu.model");

class MenuService {
  static async resetMenus() {
    try {
      // Delete all existing menus
      await Menu.deleteMany({});
      console.log("All menus deleted");
      
      // Reinitialize default menus
      await this.initializeDefaultMenus();
      console.log("Menus reinitialized");
    } catch (error) {
      console.error("Error resetting menus:", error);
      throw error;
    }
  }

  static async initializeDefaultMenus() {
    try {
      // Check if menus already exist
      const existingMenus = await Menu.countDocuments();
      if (existingMenus > 0) {
        console.log("Default menus already initialized");
        return;
      }

      console.log("Initializing default menus...");

      // Create main menu items
      const dashboardMenu = await Menu.create({
        name: "Dashboard",
        link: "/admin/dashboard",
        icon: "MdDashboard",
        parentId: null,
        order: 1,
        isActive: true,
        roles: ["ADMIN"]
      });

      // Rename "Admin Menu List" to "Categories"
      const categoriesMenu = await Menu.create({
        name: "Categories",
        link: "/admin/category",
        icon: "MdCategory",
        parentId: null,
        order: 2,
        isActive: true,
        roles: ["ADMIN"]
      });

      const productsMenu = await Menu.create({
        name: "Products",
        link: "#",
        icon: "MdShoppingCart",
        parentId: null,
        order: 3,
        isActive: true,
        roles: ["ADMIN"]
      });

      const pricingMenu = await Menu.create({
        name: "Pricing",
        link: "#",
        icon: "MdOutlinePriceChange",
        parentId: null,
        order: 4,
        isActive: true,
        roles: ["ADMIN"]
      });

      const inventoryMenu = await Menu.create({
        name: "Inventory",
        link: "#",
        icon: "MdInventory",
        parentId: null,
        order: 5,
        isActive: true,
        roles: ["ADMIN"]
      });

      const ordersMenu = await Menu.create({
        name: "Orders",
        link: "#",
        icon: "MdAssessment",
        parentId: null,
        order: 6,
        isActive: true,
        roles: ["ADMIN"]
      });

      const customersMenu = await Menu.create({
        name: "Customers",
        link: "#",
        icon: "MdPeopleAlt",
        parentId: null,
        order: 7,
        isActive: true,
        roles: ["ADMIN"]
      });

      const marketingMenu = await Menu.create({
        name: "Marketing",
        link: "#",
        icon: "MdCampaign",
        parentId: null,
        order: 8,
        isActive: true,
        roles: ["ADMIN"]
      });

      const contentMenu = await Menu.create({
        name: "Content",
        link: "#",
        icon: "MdImage",
        parentId: null,
        order: 9,
        isActive: true,
        roles: ["ADMIN"]
      });

      const reportsMenu = await Menu.create({
        name: "Reports",
        link: "#",
        icon: "MdReport",
        parentId: null,
        order: 10,
        isActive: true,
        roles: ["ADMIN"]
      });

      const paymentsMenu = await Menu.create({
        name: "Payments",
        link: "#",
        icon: "MdPayment",
        parentId: null,
        order: 11,
        isActive: true,
        roles: ["ADMIN"]
      });

      const settingsMenu = await Menu.create({
        name: "Settings",
        link: "#",
        icon: "MdSettings",
        parentId: null,
        order: 12,
        isActive: true,
        roles: ["ADMIN"]
      });

      const menuManagement = await Menu.create({
        name: "Menu Management",
        link: "/admin/menu-management",
        icon: "MdMenu",
        parentId: null,
        order: 13,
        isActive: true,
        roles: ["ADMIN"]
      });

      // Create CMS menus
      const cmsDashboard = await Menu.create({
        name: "Dashboard",
        link: "/cms/dashboard",
        icon: "MdDashboard",
        parentId: null,
        order: 1,
        isActive: true,
        roles: ["CMS"]
      });

      const cmsMenuList = await Menu.create({
        name: "CMS Menu List",
        link: "#",
        icon: "MdCollections",
        parentId: null,
        order: 2,
        isActive: true,
        roles: ["CMS"]
      });

      // Create submenus for Categories - only Add and List
      await Menu.create({
        name: "Add Category",
        link: "/admin/category/new",
        icon: "",
        parentId: categoriesMenu._id,
        order: 1,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Category List",
        link: "/admin/category/list",
        icon: "",
        parentId: categoriesMenu._id,
        order: 2,
        isActive: true,
        roles: ["ADMIN"]
      });

      // Products submenus
      await Menu.create({
        name: "Add Product",
        link: "/admin/product/new",
        icon: "",
        parentId: productsMenu._id,
        order: 1,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Product List",
        link: "/admin/product/list",
        icon: "",
        parentId: productsMenu._id,
        order: 2,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Variant Management",
        link: "/admin/product/variants",
        icon: "",
        parentId: productsMenu._id,
        order: 4,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Price Management",
        link: "/admin/product/prices",
        icon: "",
        parentId: productsMenu._id,
        order: 5,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Stock Management",
        link: "/admin/product/stock",
        icon: "",
        parentId: productsMenu._id,
        order: 6,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Upload Image",
        link: "/admin/product/upload",
        icon: "",
        parentId: productsMenu._id,
        order: 7,
        isActive: true,
        roles: ["ADMIN"]
      });

      // Pricing submenus
      await Menu.create({
        name: "Price Groups",
        link: "/admin/pricing/groups",
        icon: "",
        parentId: pricingMenu._id,
        order: 1,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Discounts",
        link: "/admin/pricing/discounts",
        icon: "",
        parentId: pricingMenu._id,
        order: 2,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Coupons",
        link: "/admin/pricing/coupons",
        icon: "",
        parentId: pricingMenu._id,
        order: 3,
        isActive: true,
        roles: ["ADMIN"]
      });

      // Inventory submenus
      await Menu.create({
        name: "Stock Levels",
        link: "/admin/inventory/levels",
        icon: "",
        parentId: inventoryMenu._id,
        order: 1,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Warehouses",
        link: "/admin/inventory/warehouses",
        icon: "",
        parentId: inventoryMenu._id,
        order: 2,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Suppliers",
        link: "/admin/inventory/suppliers",
        icon: "",
        parentId: inventoryMenu._id,
        order: 3,
        isActive: true,
        roles: ["ADMIN"]
      });

      // Orders submenus
      await Menu.create({
        name: "Order List",
        link: "/admin/orders/list",
        icon: "",
        parentId: ordersMenu._id,
        order: 1,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Returns",
        link: "/admin/orders/returns",
        icon: "",
        parentId: ordersMenu._id,
        order: 2,
        isActive: true,
        roles: ["ADMIN"]
      });

      // Customers submenus
      await Menu.create({
        name: "Customer List",
        link: "/admin/customers/list",
        icon: "",
        parentId: customersMenu._id,
        order: 1,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Groups",
        link: "/admin/customers/groups",
        icon: "",
        parentId: customersMenu._id,
        order: 2,
        isActive: true,
        roles: ["ADMIN"]
      });

      // Marketing submenus
      await Menu.create({
        name: "Campaigns",
        link: "/admin/marketing/campaigns",
        icon: "",
        parentId: marketingMenu._id,
        order: 1,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Reviews",
        link: "/admin/marketing/reviews",
        icon: "",
        parentId: marketingMenu._id,
        order: 2,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "SEO",
        link: "/admin/marketing/seo",
        icon: "",
        parentId: marketingMenu._id,
        order: 3,
        isActive: true,
        roles: ["ADMIN"]
      });

      // Content submenus
      await Menu.create({
        name: "Pages",
        link: "/admin/content/pages",
        icon: "",
        parentId: contentMenu._id,
        order: 1,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Media Library",
        link: "/admin/content/media",
        icon: "",
        parentId: contentMenu._id,
        order: 2,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Navigation",
        link: "/admin/content/navigation",
        icon: "",
        parentId: contentMenu._id,
        order: 3,
        isActive: true,
        roles: ["ADMIN"]
      });

      // Reports submenus
      await Menu.create({
        name: "Sales Reports",
        link: "/admin/reports/sales",
        icon: "",
        parentId: reportsMenu._id,
        order: 1,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Inventory Reports",
        link: "/admin/reports/inventory",
        icon: "",
        parentId: reportsMenu._id,
        order: 2,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Customer Reports",
        link: "/admin/reports/customers",
        icon: "",
        parentId: reportsMenu._id,
        order: 3,
        isActive: true,
        roles: ["ADMIN"]
      });

      // Payments submenus
      await Menu.create({
        name: "Payment Methods",
        link: "/admin/payments/methods",
        icon: "",
        parentId: paymentsMenu._id,
        order: 1,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Transactions",
        link: "/admin/payments/transactions",
        icon: "",
        parentId: paymentsMenu._id,
        order: 2,
        isActive: true,
        roles: ["ADMIN"]
      });

      // Settings submenus
      await Menu.create({
        name: "General Settings",
        link: "/admin/settings/general",
        icon: "",
        parentId: settingsMenu._id,
        order: 1,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Locations",
        link: "/admin/settings/locations",
        icon: "",
        parentId: settingsMenu._id,
        order: 2,
        isActive: true,
        roles: ["ADMIN"]
      });

      await Menu.create({
        name: "Taxes",
        link: "/admin/settings/taxes",
        icon: "",
        parentId: settingsMenu._id,
        order: 3,
        isActive: true,
        roles: ["ADMIN"]
      });

      // CMS submenus
      await Menu.create({
        name: "Posts",
        link: "/cms/posts",
        icon: "",
        parentId: cmsMenuList._id,
        order: 1,
        isActive: true,
        roles: ["CMS"]
      });

      await Menu.create({
        name: "Pages",
        link: "/cms/pages",
        icon: "",
        parentId: cmsMenuList._id,
        order: 2,
        isActive: true,
        roles: ["CMS"]
      });

      await Menu.create({
        name: "Media",
        link: "/cms/media",
        icon: "",
        parentId: cmsMenuList._id,
        order: 3,
        isActive: true,
        roles: ["CMS"]
      });

      console.log("Default menus initialized successfully");
    } catch (error) {
      console.error("Error initializing default menus:", error);
    }
  }

  // Get menus by role
  static async getMenusByRole(role) {
    try {
      const menus = await Menu.find({ 
        roles: role, 
        isActive: true 
      }).sort({ parentId: 1, order: 1 });

      return this.buildMenuTree(menus);
    } catch (error) {
      throw new Error("Error fetching menus by role");
    }
  }

  // Build hierarchical menu tree
  static buildMenuTree(menus, parentId = null) {
    return menus
      .filter(menu => {
        const menuParentId = menu.parentId ? menu.parentId.toString() : null;
        const compareParentId = parentId ? parentId.toString() : null;
        return menuParentId === compareParentId;
      })
      .map(menu => {
        const children = this.buildMenuTree(menus, menu._id);
        return {
          ...menu.toObject(),
          children: children.length > 0 ? children : undefined
        };
      })
      .sort((a, b) => a.order - b.order);
  }
}

module.exports = MenuService;