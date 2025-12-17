const Menu = require("../models/Menu.model");
const mongoose = require("mongoose");

// Get all menus for a specific role
exports.getMenusByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    // Validate role
    if (!["ADMIN", "CMS", "USER"].includes(role)) {
      return res.status(400).json({ 
        data: null,
        outcome: false,
        message: "Invalid role. Role must be ADMIN, CMS, or USER" 
      });
    }
    
    // Find all active menus for the specified role
    const menus = await Menu.find({ 
      roles: role, 
      isActive: true 
    })
    .sort({ parentId: 1, order: 1 });
    
    // Build hierarchical menu structure
    const menuTree = buildMenuTree(menus);
    
    return res.status(200).json({
      data: menuTree,
      outcome: true,
      message: "Menus fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching menus:", error);
    return res.status(500).json({ 
      data: null,
      outcome: false,
      message: "Server error while fetching menus" 
    });
  }
};

// Get all menus (for admin management)
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find().sort({ parentId: 1, order: 1 });
    
    return res.status(200).json({
      data: menus,
      outcome: true,
      message: "All menus fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching all menus:", error);
    return res.status(500).json({ 
      data: null,
      outcome: false,
      message: "Server error while fetching menus" 
    });
  }
};

// Create a new menu item
exports.createMenu = async (req, res) => {
  try {
    const { name, link, icon, parentId, order, isActive, roles } = req.body;

    // Validate required fields
    if (!name || !link || !roles) {
      return res.status(400).json({ 
        data: null,
        outcome: false,
        message: "Name, link, and roles are required" 
      });
    }

    // Validate roles array
    if (!Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({ 
        data: null,
        outcome: false,
        message: "Invalid roles provided. At least one role is required" 
      });
    }

    // Validate order is not negative
    if (order !== undefined && (typeof order !== 'number' || order < 0)) {
      return res.status(400).json({ 
        data: null,
        outcome: false,
        message: "Order must be a positive number or zero" 
      });
    }

    // Validate parentId if provided
    let validatedParentId = null;
    if (parentId) {
      // Check if parentId is a valid ObjectId string
      if (mongoose.Types.ObjectId.isValid(parentId)) {
        validatedParentId = parentId;
      } else {
        return res.status(400).json({ 
          data: null,
          outcome: false,
          message: "Invalid parentId. Must be a valid ObjectId" 
        });
      }
    }

    const menu = new Menu({
      name,
      link,
      icon: icon || null,
      parentId: validatedParentId,
      order: order !== undefined ? order : 0,
      isActive: isActive !== undefined ? isActive : true,
      roles
    });

    const savedMenu = await menu.save();

    return res.status(201).json({
      data: savedMenu,
      outcome: true,
      message: "Menu created successfully"
    });
  } catch (error) {
    console.error("Error creating menu:", error);
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({ 
        data: null,
        outcome: false,
        message: "Validation error: " + errorMessage
      });
    }
    // Check for duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        data: null,
        outcome: false,
        message: "Duplicate menu entry. A menu with this name or link may already exist."
      });
    }
    return res.status(500).json({ 
      data: null,
      outcome: false,
      message: "Server error while creating menu" 
    });
  }
};

// Update menu function
exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate roles if provided
    if (updates.roles && (!Array.isArray(updates.roles) || updates.roles.length === 0)) {
      return res.status(400).json({ 
        data: null,
        outcome: false,
        message: "Invalid roles provided. At least one role is required" 
      });
    }

    // Validate order is not negative if provided
    if (updates.order !== undefined && (typeof updates.order !== 'number' || updates.order < 0)) {
      return res.status(400).json({ 
        data: null,
        outcome: false,
        message: "Order must be a positive number or zero" 
      });
    }

    // Validate parentId if provided in updates
    if (updates.parentId) {
      // Check if parentId is a valid ObjectId string
      if (!mongoose.Types.ObjectId.isValid(updates.parentId)) {
        return res.status(400).json({ 
          data: null,
          outcome: false,
          message: "Invalid parentId. Must be a valid ObjectId" 
        });
      }
    } else if (updates.parentId === "") {
      // Convert empty string to null
      updates.parentId = null;
    }

    const menu = await Menu.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!menu) {
      return res.status(404).json({ 
        data: null,
        outcome: false,
        message: "Menu not found" 
      });
    }

    return res.status(200).json({
      data: menu,
      outcome: true,
      message: "Menu updated successfully"
    });
  } catch (error) {
    console.error("Error updating menu:", error);
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
      return res.status(400).json({ 
        data: null,
        outcome: false,
        message: "Validation error: " + errorMessage
      });
    }
    // Check for duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        data: null,
        outcome: false,
        message: "Duplicate menu entry. A menu with this name or link may already exist."
      });
    }
    return res.status(500).json({ 
      data: null,
      outcome: false,
      message: "Server error while updating menu" 
    });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await Menu.findByIdAndDelete(id);

    if (!menu) {
      return res.status(404).json({ 
        data: null,
        outcome: false,
        message: "Menu not found" 
      });
    }

    return res.status(200).json({
      data: null,
      outcome: true,
      message: "Menu deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting menu:", error);
    return res.status(500).json({ 
      data: null,
      outcome: false,
      message: "Server error while deleting menu" 
    });
  }
};

exports.toggleMenuStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({ 
        data: null,
        outcome: false,
        message: "Menu not found" 
      });
    }

    menu.isActive = !menu.isActive;
    const updatedMenu = await menu.save();

    return res.status(200).json({
      data: updatedMenu,
      outcome: true,
      message: `Menu ${updatedMenu.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error("Error toggling menu status:", error);
    return res.status(500).json({ 
      data: null,
      outcome: false,
      message: "Server error while toggling menu status" 
    });
  }
};

// Helper function to build hierarchical menu tree
function buildMenuTree(menus, parentId = null) {
  return menus
    .filter(menu => {
      // Convert parentId to string for comparison
      const menuParentId = menu.parentId ? menu.parentId.toString() : null;
      const compareParentId = parentId ? parentId.toString() : null;
      return menuParentId === compareParentId;
    })
    .map(menu => {
      const children = buildMenuTree(menus, menu._id);
      return {
        ...menu.toObject(),
        children: children.length > 0 ? children : undefined
      };
    })
    .sort((a, b) => a.order - b.order);
}