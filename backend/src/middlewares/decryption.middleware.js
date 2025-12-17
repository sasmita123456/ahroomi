const EncryptionService = require("../services/encryption.service");
const FrontendEncryptionService = require("../services/frontend-encryption.service");


const decryptPayload = (req, res, next) => {
  try {
    if (req.body && req.body.encryptedData && req.body.iv) {
      try {
        const decryptedData = FrontendEncryptionService.decryptFromFrontend(
          req.body.encryptedData,
          req.body.iv
        );
        
        req.body = JSON.parse(decryptedData);
      } catch (decryptError) {
        console.error('Failed to decrypt full payload:', decryptError);
       
      }
    }
    else if (req.body && req.body.encryptedData && req.body.authTag) {
      try {
        const decryptedData = FrontendEncryptionService.decryptWithFixedIV(
          req.body.encryptedData,
          req.body.authTag
        );
        
        req.body = JSON.parse(decryptedData);
      } catch (decryptError) {
        console.error('Failed to decrypt full payload with fixed IV:', decryptError);
      
      }
    }
    else if (req.body && req.body._encryptionMetadata) {
      const { sensitiveFields } = req.body._encryptionMetadata;
      
      sensitiveFields.forEach(field => {
        if (req.body[field] && req.body[`${field}_authTag`]) {
          try {
            const decrypted = EncryptionService.decrypt(
              req.body[field], 
              req.body[`${field}_authTag`]
            );
            
            req.body[field] = decrypted[field];
            
            delete req.body[`${field}_authTag`];
          } catch (decryptError) {
            console.error(`Failed to decrypt field ${field}:`, decryptError);
            
          }
        }
      });
      
      delete req.body._encryptionMetadata;
    }
    
    next();
  } catch (error) {
    console.error('Decryption middleware error:', error);
    next();
  }
};

module.exports = decryptPayload;