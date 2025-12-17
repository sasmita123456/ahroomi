const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    // parentCategory: { type: String },
    shortDesc: { type: String },
    longDesc: { type: String },
    thumbnail: { type: String }, 
    banner: { type: String },
    isActive: { type: Boolean, default: true } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);