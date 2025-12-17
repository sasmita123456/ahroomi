const express = require("express");
const router = express.Router();

const { encryptData, decryptData } = require("../controllers/encryption.controller");
const FrontendEncryptionService = require("../services/frontend-encryption.service");

router.post("/encrypt", encryptData);

router.post("/decrypt", decryptData);

router.post("/decrypt-frontend", (req, res) => {
  try {
    const { encryptedData, iv } = req.body;
    
    if (!encryptedData || !iv) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing encryptedData or iv" 
      });
    }
    
    const decrypted = FrontendEncryptionService.decryptFromFrontend(encryptedData, iv);
    
    return res.status(200).json({ 
      success: true, 
      data: decrypted 
    });
  } catch (error) {
    return res.status(400).json({ 
      success: false, 
      message: "Decryption failed: " + error.message 
    });
  }
});

router.post("/decrypt-frontend-fixed", (req, res) => {
  try {
    const { encryptedData, authTag } = req.body;
    
    if (!encryptedData || !authTag) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing encryptedData or authTag" 
      });
    }
    
    const decrypted = FrontendEncryptionService.decryptWithFixedIV(encryptedData, authTag);
    
    return res.status(200).json({ 
      success: true, 
      data: decrypted 
    });
  } catch (error) {
    return res.status(400).json({ 
      success: false, 
      message: "Decryption failed: " + error.message 
    });
  }
});

module.exports = router;