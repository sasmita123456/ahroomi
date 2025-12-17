const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const cmsRoutes = require("./routes/cms.routes");
const paymentRoutes = require("./routes/payment.routes");
const encryptionRoutes = require("./routes/encryption.routes");
const protectedRoutes = require("./routes/protected.routes");
const sampleSecureRoutes = require("./routes/sample-secure.routes");
const categoryRoutes = require("./routes/category.routes");
const menuRoutes = require("./routes/menu.routes");
const productRoutes = require("./routes/product.routes");

const errorMiddleware = require("./middlewares/error.middleware");
const decryptPayload = require("./middlewares/decryption.middleware");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(morgan("dev"));

app.use(decryptPayload);

app.use("/uploads", express.static(path.join(__dirname, "../category-upload")));
app.use("/product-upload", express.static(path.join(__dirname, "../product-upload")));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cms", cmsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/encryption", encryptionRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/secure", sampleSecureRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/product", productRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend API is running... 🚀" });
});

app.use(errorMiddleware);

module.exports = app;