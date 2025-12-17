const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema({
  thumbnail: { type: String },
  longImage: { type: String },
  alt: { type: String },
  title: { type: String }
  // Removed productId reference since it's not needed
});

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    productSlug: { type: String, required: true, unique: true },
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category',
      required: true
    },
    tags: [{ type: String }],
    shortDescription: { type: String },
    longDescription: { type: String },
    sku: { type: String, required: true, unique: true },
    images: [productImageSchema],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);