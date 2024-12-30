// Encryption utilities
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Generate encryption key from user's email
export const deriveKey = async (email) => {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(email),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('A-MACI-salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

// Encrypt data
export const encryptData = async (data, key) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(JSON.stringify(data))
  );

  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encryptedData))
  };
};

// Decrypt data
export const decryptData = async (encryptedData, key) => {
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
    key,
    new Uint8Array(encryptedData.data)
  );

  return JSON.parse(decoder.decode(decrypted));
};