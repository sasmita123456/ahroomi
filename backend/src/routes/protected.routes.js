const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth.middleware");

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

module.exports = router;