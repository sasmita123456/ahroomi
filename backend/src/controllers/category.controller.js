const Category = require("../models/Category.model");
const upload = require("../config/multer.config");
const FrontendEncryptionService = require("../services/frontend-encryption.service");
const fs = require("fs");
const path = require("path");

exports.addCategory = async (req, res) => {
  try {
    let thumbnailPath = null;
    let bannerPath = null;
    
    if (req.files) {
      if (req.files.thumbnail) {
        thumbnailPath = `/uploads/${req.files.thumbnail[0].filename}`;
      }
      if (req.files.banner) {
        bannerPath = `/uploads/${req.files.banner[0].filename}`;
      }
    }
    
    let categoryData = {};
    
    if (req.body.encryptedData && req.body.iv) {
      try {
        const decryptedData = FrontendEncryptionService.decryptFromFrontend(
          req.body.encryptedData,
          req.body.iv
        );
        categoryData = JSON.parse(decryptedData);
      } catch (decryptError) {
        console.error("Decryption error:", decryptError);
        return res.status(400).json({
          data: null,
          outcome: false,
          message: "Failed to decrypt category data: " + decryptError.message
        });
      }
    } 
    else if (req.body.data) {
      try {
        categoryData = JSON.parse(req.body.data);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        return res.status(400).json({
          data: null,
          outcome: false,
          message: "Invalid JSON data: " + parseError.message
        });
      }
    }
    else {
      categoryData = { ...req.body };
      delete categoryData.thumbnail;
      delete categoryData.banner;
      delete categoryData.encryptedData;
      delete categoryData.iv;
      delete categoryData.data;
    }
    
    const categoryObj = {
      ...categoryData,
      thumbnail: thumbnailPath,
      banner: bannerPath
    };
    
    const newCategory = new Category(categoryObj);
    const savedCategory = await newCategory.save();
    
    res.status(201).json({
      data: null,
      outcome: true,
      message: "Category created successfully"
    });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({
      data: null,
      outcome: false,
      message: "Error creating category: " + error.message
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      data: categories,
      outcome: true,
      message: "Categories fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      data: null,
      outcome: false,
      message: "Error fetching categories: " + error.message
    });
  }
};

// Get only active categories
exports.getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    
    res.status(200).json({
      data: categories,
      outcome: true,
      message: "Active categories fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching active categories:", error);
    res.status(500).json({
      data: null,
      outcome: false,
      message: "Error fetching active categories: " + error.message
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        data: null,
        outcome: false,
        message: "Category not found"
      });
    }
    
    res.status(200).json({
      data: category,
      outcome: true,
      message: "Category fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      data: null,
      outcome: false,
      message: "Error fetching category: " + error.message
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    let updateData = {};
    
    if (req.files) {
      // First, get the existing category to delete old files
      const existingCategory = await Category.findById(id);
      
      if (req.files.thumbnail) {
        // Delete old thumbnail file if it exists
        if (existingCategory && existingCategory.thumbnail) {
          const oldFilePath = path.join(__dirname, "../../..", existingCategory.thumbnail);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        updateData.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
      }
      
      if (req.files.banner) {
        // Delete old banner file if it exists
        if (existingCategory && existingCategory.banner) {
          const oldFilePath = path.join(__dirname, "../../..", existingCategory.banner);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        updateData.banner = `/uploads/${req.files.banner[0].filename}`;
      }
    }
    
    if (req.body.encryptedData && req.body.iv) {
      try {
        const decryptedData = FrontendEncryptionService.decryptFromFrontend(
          req.body.encryptedData,
          req.body.iv
        );
        updateData = { ...updateData, ...JSON.parse(decryptedData) };
      } catch (decryptError) {
        console.error("Decryption error:", decryptError);
        return res.status(400).json({
          data: null,
          outcome: false,
          message: "Failed to decrypt category data: " + decryptError.message
        });
      }
    } 
    else if (req.body.data) {
      try {
        updateData = { ...updateData, ...JSON.parse(req.body.data) };
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        return res.status(400).json({
          data: null,
          outcome: false,
          message: "Invalid JSON data: " + parseError.message
        });
      }
    }
    else {
      updateData = { ...updateData, ...req.body };
      delete updateData.thumbnail;
      delete updateData.banner;
      delete updateData.encryptedData;
      delete updateData.iv;
      delete updateData.data;
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({
        data: null,
        outcome: false,
        message: "Category not found"
      });
    }
    
    res.status(200).json({
      data: null,
      outcome: true,
      message: "Category updated successfully"
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      data: null,
      outcome: false,
      message: "Error updating category: " + error.message
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, get the category to delete associated image files
    const categoryToDelete = await Category.findById(id);
    
    if (!categoryToDelete) {
      return res.status(404).json({
        data: null,
        outcome: false,
        message: "Category not found"
      });
    }
    
    // Delete associated image files
    // Delete thumbnail if it exists
    if (categoryToDelete.thumbnail) {
      const thumbnailPath = path.join(__dirname, "../../..", categoryToDelete.thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }
    
    // Delete banner if it exists
    if (categoryToDelete.banner) {
      const bannerPath = path.join(__dirname, "../../..", categoryToDelete.banner);
      if (fs.existsSync(bannerPath)) {
        fs.unlinkSync(bannerPath);
      }
    }
    
    // Now delete the category from the database
    const deletedCategory = await Category.findByIdAndDelete(id);
    
    res.status(200).json({
      data: null,
      outcome: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      data: null,
      outcome: false,
      message: "Error deleting category: " + error.message
    });
  }
};