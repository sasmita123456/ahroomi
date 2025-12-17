const EncryptionService = require("../services/encryption.service");

exports.encryptData = (req, res) => {
  try {
    const payload = req.body;

    const encrypted = EncryptionService.encrypt(payload);

    return res.status(200).json({
      success: true,
      encrypted: encrypted.encrypted,
      authTag: encrypted.authTag,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.decryptData = (req, res) => {
  try {
    const { encrypted, authTag } = req.body;

    if (!encrypted || !authTag) {
      return res.status(400).json({ success: false, message: "Missing encrypted or authTag" });
    }

    const decrypted = EncryptionService.decrypt(encrypted, authTag);

    return res.status(200).json({ success: true, data: decrypted });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Decryption failed: " + error.message });
  }
};
