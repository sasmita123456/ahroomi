const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create directories for both category and product uploads
const categoryUploadDir = path.join(__dirname, "../../category-upload");
const productUploadDir = path.join(__dirname, "../../product-upload");

if (!fs.existsSync(categoryUploadDir)) {
  fs.mkdirSync(categoryUploadDir, { recursive: true });
}
if (!fs.existsSync(productUploadDir)) {
  fs.mkdirSync(productUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine which directory to use based on the route or field name
    if (req.originalUrl && req.originalUrl.includes('/product/')) {
      cb(null, productUploadDir);
    } else {
      cb(null, categoryUploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024 
  }
});

module.exports = upload;