import apiClient from '../config/axios.config';

// For Next.js, we use process.env instead of import.meta.env
const SECRET_KEY_BASE64 = process.env.NEXT_PUBLIC_SECRET_KEY;

// Convert base64 key to raw bytes (ArrayBuffer)
const SECRET_KEY = SECRET_KEY_BASE64 ? base64ToArrayBuffer(SECRET_KEY_BASE64) : null;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const isCryptoAvailable = () => {
  return typeof window !== 'undefined' && 
         window.crypto && 
         window.crypto.subtle;
};

/**
 * Converts a base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Prepares a payload for submission with selective field encryption
 * This marks fields for backend encryption rather than encrypting directly in frontend
 * @param payload The payload to prepare
 * @param sensitiveFields Array of field names to mark for encryption
 * @returns Payload with metadata for backend processing
 */
export const prepareEncryptedPayload = (payload: any, sensitiveFields: string[]) => {
  const preparedPayload: any = { ...payload };
  
  // Mark sensitive fields for backend encryption
  preparedPayload._encryptionMetadata = {
    sensitiveFields: sensitiveFields,
    timestamp: new Date().toISOString()
  };
  
  return preparedPayload;
};

export async function encryptPayload(payload: any) {
  try {
    if (!SECRET_KEY) {
      console.error("SECRET_KEY is not defined. Please set NEXT_PUBLIC_SECRET_KEY in your environment variables.");
      return null;
    }
    
    if (!isCryptoAvailable()) {
      console.error("Crypto API is not available. This might be due to an insecure context (non-HTTPS) or server-side rendering.");
      return null;
    }
    
    const payloadString = typeof payload === "string" ? payload : JSON.stringify(payload);
    const data = encoder.encode(payloadString);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const key = await window.crypto.subtle.importKey(
      "raw",
      SECRET_KEY,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    const encryptedBytes = new Uint8Array(encryptedBuffer);
    const encryptedBase64 = btoa(String.fromCharCode(...encryptedBytes));
    const ivBase64 = btoa(String.fromCharCode(...iv));

    return {
      iv: ivBase64,
      data: encryptedBase64,
    };
  } catch (err: any) {
    console.error("Encryption error:", err);
    // Enhanced error detection for browser extension interference
    if (err.message && (err.message.includes("message channel") || err.message.includes("Extension") || err.message.includes("listener"))) {
      throw new Error("Browser extension interference detected during encryption. Please disable extensions or use incognito mode.");
    }
    return null;
  }
}

export async function decryptPayload(encryptedBase64: string, ivBase64: string) {
  try {
    // First try to decrypt using the backend service
    try {
      const response = await apiClient.post('/encryption/decrypt-frontend', {
        encryptedData: encryptedBase64,
        iv: ivBase64
      });
      
      if (response.data.success) {
        return response.data.data;
      }
    } catch (backendError) {
      console.warn("Backend decryption failed, falling back to client-side decryption:", backendError);
    }
    
    // Fallback to client-side decryption if backend fails
    // Check if SECRET_KEY is defined
    if (!SECRET_KEY) {
      console.error("SECRET_KEY is not defined. Please set NEXT_PUBLIC_SECRET_KEY in your environment variables.");
      return null;
    }
    
    // Check if crypto is available
    if (!isCryptoAvailable()) {
      console.error("Crypto API is not available. This might be due to an insecure context (non-HTTPS) or server-side rendering.");
      return null;
    }
   
    const encryptedBytes = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));

    const key = await window.crypto.subtle.importKey(
      "raw",
      SECRET_KEY,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedBytes
    );

    const decryptedText = decoder.decode(decryptedBuffer);
    return decryptedText;
  } catch (err: any) {
    console.error("Decryption error:", err);
    // Enhanced error detection for browser extension interference
    if (err.message && (err.message.includes("message channel") || err.message.includes("Extension") || err.message.includes("listener"))) {
      throw new Error("Browser extension interference detected during decryption. Please disable extensions or use incognito mode.");
    }
    return null;
  }
}

export const encryptPayloadAll = async (payload: any) => {
  const encrypted = await encryptPayload(payload);
  if (!encrypted) {
    throw new Error('Payload encryption failed');
  }
  
  return {
    encryptedData: encrypted.data,
    iv: encrypted.iv
  };
};
