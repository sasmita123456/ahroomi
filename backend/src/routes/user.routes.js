const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth.middleware");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

router.get("/profile", authenticate, async (req, res) => {
  try {
    res.status(200).json({
      message: "Profile fetched successfully",
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/profile", authenticate, async (req, res) => {
  try {
    const { name, email, mobile, password, confirmPassword } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (mobile !== undefined) updateData.mobile = mobile;
    
    if (password) {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");
    
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;