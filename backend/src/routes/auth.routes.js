const express = require("express");
const router = express.Router();

const { registerUser, loginUser, refreshToken, cmsLogin, secureCmsLogin, adminLogin, verifyOtp } = require("../controllers/auth.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/cms-login", cmsLogin);
router.post("/secure-cms-login", secureCmsLogin);
router.post("/admin-login", adminLogin);
router.post("/verify-otp", verifyOtp);
router.post("/refresh", refreshToken);
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;