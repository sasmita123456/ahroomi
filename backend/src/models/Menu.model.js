const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Menu name is required"],
    trim: true,
    maxlength: [100, "Menu name cannot exceed 100 characters"]
  },
  link: { 
    type: String, 
    required: [true, "Menu link is required"],
    trim: true,
    maxlength: [200, "Menu link cannot exceed 200 characters"]
  },
  icon: { 
    type: String,
    trim: true,
    maxlength: [50, "Icon name cannot exceed 50 characters"]
  }, // Icon class name
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Menu', 
    default: null 
  }, // For nested menus
  order: { 
    type: Number, 
    default: 0,
    min: [0, "Order must be a positive number or zero"] // Ensure order is never negative
  }, // Display order
  isActive: { 
    type: Boolean, 
    default: true 
  },
  roles: [{ 
    type: String, 
    enum: {
      values: ["ADMIN", "CMS", "USER"],
      message: "Role must be either ADMIN, CMS, or USER"
    },
    required: [true, "At least one role is required"]
  }], 
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add index for better query performance
menuItemSchema.index({ parentId: 1, order: 1 });

// Add validation middleware to ensure order is never negative and update timestamp
// Add validation middleware to ensure order is never negative and update timestamp
menuItemSchema.pre('save', function() {
  if (this.order < 0) {
    this.order = 0;
  }
  this.updatedAt = Date.now();
});

module.exports = mongoose.model("Menu", menuItemSchema);