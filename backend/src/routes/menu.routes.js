const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menu.controller");
const authenticate = require("../middlewares/auth.middleware");

// Public routes - Get menus by role
router.get("/:role/menus", menuController.getMenusByRole);

// Protected routes - Menu management (ADMIN only)
router.get("/", authenticate, checkAdminRole, menuController.getAllMenus);
router.post("/", authenticate, checkAdminRole, menuController.createMenu);
router.put("/:id", authenticate, checkAdminRole, menuController.updateMenu);
router.delete("/:id", authenticate, checkAdminRole, menuController.deleteMenu);
router.patch("/:id/toggle", authenticate, checkAdminRole, menuController.toggleMenuStatus);

// Middleware to check if user is ADMIN
function checkAdminRole(req, res, next) {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    return res.status(403).json({ 
      data: null,
      outcome: false,
      message: "Access denied. Admin role required." 
    });
  }
}

module.exports = router;