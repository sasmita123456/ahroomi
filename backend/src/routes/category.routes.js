const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const upload = require("../config/multer.config");

router.post("/add", upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), categoryController.addCategory);

router.get("/all", categoryController.getAllCategories);

router.get("/active", categoryController.getActiveCategories);

router.get("/:id", categoryController.getCategoryById);

router.put("/:id", upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), categoryController.updateCategory);

router.delete("/:id", categoryController.deleteCategory);

module.exports = router;