const crypto = require("crypto");

const KEY = Buffer.from(process.env.AES_SECRET_KEY, "base64");
const IV = Buffer.from(process.env.AES_IV, "base64");

class EncryptionService {
  static encrypt(data) {
    const cipher = crypto.createCipheriv("aes-256-gcm", KEY, IV);

    let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    return {
      encrypted,
      authTag,
    };
  }

  static decrypt(encryptedData, authTag) {
    const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, IV);
    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return JSON.parse(decrypted);
  }
}

module.exports = EncryptionService;