const crypto = require("crypto");

const KEY = Buffer.from(process.env.AES_SECRET_KEY, "base64"); 
const IV = Buffer.from(process.env.AES_IV, "base64"); 

class FrontendEncryptionService {
  
  static decryptFromFrontend(encryptedData, iv) {
    try {
      const encryptedBuffer = Buffer.from(encryptedData, 'base64');
      const ivBuffer = Buffer.from(iv, 'base64');
      
      const authTag = encryptedBuffer.subarray(-16);
      const ciphertext = encryptedBuffer.subarray(0, -16);
      
      const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, ivBuffer);
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(ciphertext, null, "utf8");
      decrypted += decipher.final("utf8");
      
      return decrypted;
    } catch (error) {
      throw new Error("Failed to decrypt frontend payload: " + error.message);
    }
  }
}

module.exports = FrontendEncryptionService;