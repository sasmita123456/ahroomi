const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "CMS routes placeholder" });
});

module.exports = router;