const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth.middleware");
const EncryptionService = require("../services/encryption.service");

router.post("/submit-sensitive-data", authenticate, async (req, res) => {
  try {
    
    const { name, email, ssn, creditCard } = req.body;
    
    const encryptedSSN = EncryptionService.encrypt({ ssn });
    const encryptedCC = EncryptionService.encrypt({ creditCard });
    
    res.status(200).json({
      message: "Data received and processed successfully",
      receivedData: {
        name,
        email,
        ssn: encryptedSSN.encrypted,
        ssnAuthTag: encryptedSSN.authTag,
        creditCard: encryptedCC.encrypted,
        creditCardAuthTag: encryptedCC.authTag
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
});

module.exports = router;