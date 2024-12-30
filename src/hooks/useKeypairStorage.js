import { useState, useEffect } from 'react';
import { getUser } from '../utils/auth';
import { deriveKey, encryptData, decryptData } from '../utils/crypto';
import { dbOperations } from '../utils/db';

export const useKeypairStorage = () => {
  const [keypairs, setKeypairs] = useState([]);
  const user = getUser();

  // Load keypairs from IndexedDB
  useEffect(() => {
    const loadKeypairs = async () => {
      if (!user?.email) return;

      try {
        const encryptedData = await dbOperations.getKeypairs();
        if (encryptedData) {
          const key = await deriveKey(user.email);
          const decryptedKeypairs = await decryptData(encryptedData, key);
          setKeypairs(decryptedKeypairs);
        }
      } catch (error) {
        console.error('Failed to load keypairs:', error);
      }
    };

    loadKeypairs();
  }, [user?.email]);

  // Save keypairs to IndexedDB
  const saveKeypairs = async (newKeypairs) => {
    if (!user?.email) return;

    try {
      const key = await deriveKey(user.email);
      const encryptedData = await encryptData(newKeypairs, key);
      await dbOperations.saveKeypairs(newKeypairs, encryptedData);
      setKeypairs(newKeypairs);
    } catch (error) {
      console.error('Failed to save keypairs:', error);
    }
  };

  return [keypairs, saveKeypairs];
};