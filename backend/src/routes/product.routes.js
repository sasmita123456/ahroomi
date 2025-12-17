const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const upload = require("../config/multer.config");

// Product routes
router.post("/add", upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'longImage', maxCount: 1 }
]), productController.addProduct);

router.get("/all", productController.getAllProducts);

router.get("/active", productController.getActiveProducts);

router.get("/categories", productController.getAllCategories);

router.get("/:id", productController.getProductById);

router.put("/:id", upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'longImage', maxCount: 10 } // Allow multiple long images like the upload route
]), productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

// Upload images to existing product
router.post("/:id/upload-images", upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'longImage', maxCount: 10 }
]), productController.uploadProductImages);

module.exports = router;