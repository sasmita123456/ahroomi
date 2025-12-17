const Product = require("../models/Product.model");
const Category = require("../models/Category.model");
const upload = require("../config/multer.config");
const FrontendEncryptionService = require("../services/frontend-encryption.service");
const fs = require("fs");
const path = require("path");

exports.addProduct = async (req, res) => {
  try {
    let imagePaths = [];
    
    // Handle uploaded images
    if (req.files) {
      // Process thumbnail and long image files
      for (const fieldName in req.files) {
        const files = req.files[fieldName];
        files.forEach(file => {
          const imagePath = `/product-upload/${file.filename}`;
          imagePaths.push({
            [fieldName]: imagePath,
            alt: req.body[`${fieldName}_alt`] || '',
            title: req.body[`${fieldName}_title`] || ''
            // Removed productId since it's not needed
          });
        });
      }
    }
    
    let productData = {};
    
    // Decrypt data if encrypted
    if (req.body.encryptedData && req.body.iv) {
      try {
        const decryptedData = FrontendEncryptionService.decryptFromFrontend(
          req.body.encryptedData,
          req.body.iv
        );
        productData = JSON.parse(decryptedData);
      } catch (decryptError) {
        console.error("Decryption error:", decryptError);
        return res.status(400).json({
          data: null,
          outcome: false,
          message: "Failed to decrypt product data: " + decryptError.message
        });
      }
    } 
    else if (req.body.data) {
      try {
        productData = JSON.parse(req.body.data);
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
      productData = { ...req.body };
      delete productData.thumbnail;
      delete productData.longImage;
      delete productData.encryptedData;
      delete productData.iv;
      delete productData.data;
    }
    
    // Combine image data with product data
    const productObj = {
      ...productData,
      images: imagePaths
    };
    
    const newProduct = new Product(productObj);
    const savedProduct = await newProduct.save();
    
    res.status(201).json({
      data: savedProduct,
      outcome: true,
      message: "Product created successfully"
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      data: null,
      outcome: false,
      message: "Error creating product: " + error.message
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'categoryName')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      data: products,
      outcome: true,
      message: "Products fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      data: null,
      outcome: false,
      message: "Error fetching products: " + error.message
    });
  }
};

// Get only active products
exports.getActiveProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('category', 'categoryName')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      data: products,
      outcome: true,
      message: "Active products fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching active products:", error);
    res.status(500).json({
      data: null,
      outcome: false,
      message: "Error fetching active products: " + error.message
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('category', 'categoryName');
    
    if (!product) {
      return res.status(404).json({
        data: null,
        outcome: false,
        message: "Product not found"
      });
    }
    
    res.status(200).json({
      data: product,
      outcome: true,
      message: "Product fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      data: null,
      outcome: false,
      message: "Error fetching product: " + error.message
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    let updateData = {};
    
    // Handle uploaded images
    let imagesModified = false;
    if (req.files) {
      // First, get the existing product to preserve existing images and delete old files
      const existingProduct = await Product.findById(id);
      
      // Initialize images array with existing images
      let imagesArray = existingProduct.images || [];
      
      // Check if we're replacing existing images
      const replaceThumbnailIndex = req.body.replaceThumbnailIndex !== undefined ? parseInt(req.body.replaceThumbnailIndex) : -1;
      const replaceLongImageIndex = req.body.replaceLongImageIndex !== undefined ? parseInt(req.body.replaceLongImageIndex) : -1;
      
      // Track which images have been modified
      const modifiedIndices = new Set();
      
      // Process new uploaded images
      for (const fieldName in req.files) {
        const files = req.files[fieldName];
        files.forEach(file => {
          const imagePath = `/product-upload/${file.filename}`;
          
          // Check if we're explicitly replacing a specific image slot
          if (fieldName === 'thumbnail' && replaceThumbnailIndex >= 0 && replaceThumbnailIndex < imagesArray.length) {
            // Delete old thumbnail file if it exists
            if (imagesArray[replaceThumbnailIndex].thumbnail) {
              const oldFilePath = path.join(__dirname, "../../..", imagesArray[replaceThumbnailIndex].thumbnail);
              if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
              }
            }
            
            // Replace existing thumbnail in specified slot
            imagesArray[replaceThumbnailIndex].thumbnail = imagePath;
            // Only update alt/title if new values are provided
            if (req.body.thumbnail_alt !== undefined) {
              imagesArray[replaceThumbnailIndex].alt = req.body.thumbnail_alt;
            }
            if (req.body.thumbnail_title !== undefined) {
              imagesArray[replaceThumbnailIndex].title = req.body.thumbnail_title;
            }
            modifiedIndices.add(replaceThumbnailIndex);
            imagesModified = true;
          } else if (fieldName === 'longImage' && replaceLongImageIndex >= 0 && replaceLongImageIndex < imagesArray.length) {
            // Delete old long image file if it exists
            if (imagesArray[replaceLongImageIndex].longImage) {
              const oldFilePath = path.join(__dirname, "../../..", imagesArray[replaceLongImageIndex].longImage);
              if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
              }
            }
            
            // Replace existing long image in specified slot
            imagesArray[replaceLongImageIndex].longImage = imagePath;
            // Only update alt/title if new values are provided
            if (req.body.longImage_alt !== undefined) {
              imagesArray[replaceLongImageIndex].alt = req.body.longImage_alt;
            }
            if (req.body.longImage_title !== undefined) {
              imagesArray[replaceLongImageIndex].title = req.body.longImage_title;
            }
            modifiedIndices.add(replaceLongImageIndex);
            imagesModified = true;
          } else {
            // More flexible replacement logic - allow replacing any image type in any slot
            let imageUpdated = false;
            
            // If we have a replace index but it's out of bounds or not specified, 
            // look for slots where we can replace the opposite image type
            if ((fieldName === 'thumbnail' && replaceThumbnailIndex >= imagesArray.length) ||
                (fieldName === 'longImage' && replaceLongImageIndex >= imagesArray.length) ||
                (replaceThumbnailIndex === -1 && fieldName === 'thumbnail') ||
                (replaceLongImageIndex === -1 && fieldName === 'longImage')) {
              
              // Look for an existing image slot that has the opposite image type but not this one
              for (let i = 0; i < imagesArray.length; i++) {
                // Skip slots that are already modified in this request
                if (modifiedIndices.has(i)) continue;
                
                if (fieldName === 'thumbnail' && imagesArray[i].longImage && !imagesArray[i].thumbnail) {
                  // Found a slot with longImage but no thumbnail, add thumbnail to it
                  imagesArray[i].thumbnail = imagePath;
                  if (req.body.thumbnail_alt !== undefined) {
                    imagesArray[i].alt = req.body.thumbnail_alt;
                  }
                  if (req.body.thumbnail_title !== undefined) {
                    imagesArray[i].title = req.body.thumbnail_title;
                  }
                  modifiedIndices.add(i);
                  imageUpdated = true;
                  imagesModified = true;
                  break;
                } else if (fieldName === 'longImage' && imagesArray[i].thumbnail && !imagesArray[i].longImage) {
                  // Found a slot with thumbnail but no longImage, add longImage to it
                  imagesArray[i].longImage = imagePath;
                  if (req.body.longImage_alt !== undefined) {
                    imagesArray[i].alt = req.body.longImage_alt;
                  }
                  if (req.body.longImage_title !== undefined) {
                    imagesArray[i].title = req.body.longImage_title;
                  }
                  modifiedIndices.add(i);
                  imageUpdated = true;
                  imagesModified = true;
                  break;
                }
              }
              
              // If still not updated and we have a valid replacement index, 
              // replace whatever image type is in that slot
              if (!imageUpdated && 
                  ((fieldName === 'thumbnail' && replaceThumbnailIndex >= 0 && replaceThumbnailIndex < imagesArray.length) ||
                   (fieldName === 'longImage' && replaceLongImageIndex >= 0 && replaceLongImageIndex < imagesArray.length))) {
                
                const targetIndex = fieldName === 'thumbnail' ? replaceThumbnailIndex : replaceLongImageIndex;
                if (!modifiedIndices.has(targetIndex)) {
                  // Delete old image file if it exists
                  if (fieldName === 'thumbnail' && imagesArray[targetIndex].thumbnail) {
                    const oldFilePath = path.join(__dirname, "../../..", imagesArray[targetIndex].thumbnail);
                    if (fs.existsSync(oldFilePath)) {
                      fs.unlinkSync(oldFilePath);
                    }
                  } else if (fieldName === 'longImage' && imagesArray[targetIndex].longImage) {
                    const oldFilePath = path.join(__dirname, "../../..", imagesArray[targetIndex].longImage);
                    if (fs.existsSync(oldFilePath)) {
                      fs.unlinkSync(oldFilePath);
                    }
                  }
                  
                  // Replace whatever image type is in this slot
                  if (fieldName === 'thumbnail') {
                    delete imagesArray[targetIndex].longImage; // Remove opposite type if exists
                    imagesArray[targetIndex].thumbnail = imagePath;
                  } else {
                    delete imagesArray[targetIndex].thumbnail; // Remove opposite type if exists
                    imagesArray[targetIndex].longImage = imagePath;
                  }
                  
                  // Update alt/title
                  if (req.body[`${fieldName}_alt`] !== undefined) {
                    imagesArray[targetIndex].alt = req.body[`${fieldName}_alt`];
                  }
                  if (req.body[`${fieldName}_title`] !== undefined) {
                    imagesArray[targetIndex].title = req.body[`${fieldName}_title`];
                  }
                  
                  modifiedIndices.add(targetIndex);
                  imageUpdated = true;
                  imagesModified = true;
                }
              }
            }
            
            // If we couldn't update an existing image, add as new
            if (!imageUpdated) {
              imagesArray.push({
                [fieldName]: imagePath,
                alt: req.body[`${fieldName}_alt`] || '',
                title: req.body[`${fieldName}_title`] || ''
              });
              imagesModified = true;
            }
          }
        });
      }
      
      // Set the images array
      updateData.images = imagesArray;
    }
    
    // Handle updates to existing images (alt and title only, no file replacement)
    // Check if there are existing image updates
    if (req.body.existingImages) {
      try {
        const existingImagesUpdates = JSON.parse(req.body.existingImages);
        if (Array.isArray(existingImagesUpdates) && existingImagesUpdates.length > 0) {
          // Get the existing product to preserve existing images
          // If we just modified images, use the updateData.images, otherwise fetch from DB
          let existingImages = [];
          if (imagesModified && updateData.images) {
            existingImages = updateData.images;
          } else {
            const existingProduct = await Product.findById(id);
            existingImages = existingProduct.images || [];
          }
          
          // Update alt and title for existing images
          existingImagesUpdates.forEach(update => {
            if (update.index !== undefined && existingImages[update.index]) {
              if (update.alt !== undefined) {
                existingImages[update.index].alt = update.alt;
              }
              if (update.title !== undefined) {
                existingImages[update.index].title = update.title;
              }
            }
          });
          
          // Set the updated images array
          updateData.images = existingImages;
        }
      } catch (parseError) {
        console.error("Error parsing existing images updates:", parseError);
      }
    }
    
    // Decrypt data if encrypted
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
          message: "Failed to decrypt product data: " + decryptError.message
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
      // Clean up non-product fields
      delete updateData.thumbnail;
      delete updateData.longImage;
      delete updateData.encryptedData;
      delete updateData.iv;
      delete updateData.data;
      delete updateData.existingImages;
      delete updateData.replaceThumbnailIndex;
      delete updateData.replaceLongImageIndex;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'categoryName');
    
    if (!updatedProduct) {
      return res.status(404).json({
        data: null,
        outcome: false,
        message: "Product not found"
      });
    }
    
    res.status(200).json({
      data: updatedProduct,
      outcome: true,
      message: "Product updated successfully"
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      data: null,
      outcome: false,
      message: "Error updating product: " + error.message
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, get the product to delete associated image files
    const productToDelete = await Product.findById(id);
    
    if (!productToDelete) {
      return res.status(404).json({
        data: null,
        outcome: false,
        message: "Product not found"
      });
    }
    
    // Delete associated image files
    if (productToDelete.images && productToDelete.images.length > 0) {
      productToDelete.images.forEach(image => {
        // Delete thumbnail if it exists
        if (image.thumbnail) {
          const thumbnailPath = path.join(__dirname, "../../..", image.thumbnail);
          if (fs.existsSync(thumbnailPath)) {
            fs.unlinkSync(thumbnailPath);
          }
        }
        
        // Delete long image if it exists
        if (image.longImage) {
          const longImagePath = path.join(__dirname, "../../..", image.longImage);
          if (fs.existsSync(longImagePath)) {
            fs.unlinkSync(longImagePath);
          }
        }
      });
    }
    
    // Now delete the product from the database
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    res.status(200).json({
      data: null,
      outcome: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      data: null,
      outcome: false,
      message: "Error deleting product: " + error.message
    });
  }
};

// Get all categories for dropdown
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }, 'categoryName _id');
    
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

// Upload images to an existing product
exports.uploadProductImages = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, get the existing product
    const existingProduct = await Product.findById(id);
    
    if (!existingProduct) {
      return res.status(404).json({
        data: null,
        outcome: false,
        message: "Product not found"
      });
    }
    
    // Initialize images array with existing images
    let imagesArray = existingProduct.images || [];
    
    // Process new uploaded images
    if (req.files) {
      // Handle thumbnail (only one allowed)
      if (req.files.thumbnail && req.files.thumbnail.length > 0) {
        const file = req.files.thumbnail[0];
        const imagePath = `/product-upload/${file.filename}`;
        
        // Add new thumbnail to the array
        imagesArray.push({
          thumbnail: imagePath,
          alt: req.body.thumbnail_alt || '',
          title: req.body.thumbnail_title || ''
        });
      }
      
      // Handle long images (multiple allowed)
      if (req.files.longImage && req.files.longImage.length > 0) {
        req.files.longImage.forEach((file, index) => {
          const imagePath = `/product-upload/${file.filename}`;
          
          // For multiple long images, we can use indexed alt/title fields or default values
          const altKey = `longImage_alt_${index}`;
          const titleKey = `longImage_title_${index}`;
          
          imagesArray.push({
            longImage: imagePath,
            alt: req.body[altKey] || req.body.longImage_alt || '',
            title: req.body[titleKey] || req.body.longImage_title || ''
          });
        });
      }
    }
    
    // Update the product with new images
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { images: imagesArray },
      { new: true, runValidators: true }
    ).populate('category', 'categoryName');
    
    res.status(200).json({
      data: updatedProduct,
      outcome: true,
      message: "Images uploaded successfully"
    });
  } catch (error) {
    console.error("Error uploading product images:", error);
    res.status(500).json({
      data: null,
      outcome: false,
      message: "Error uploading product images: " + error.message
    });
  }
};
