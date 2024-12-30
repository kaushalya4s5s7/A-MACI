// IndexedDB wrapper
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AmaciKeypairDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('keypairs')) {
        db.createObjectStore('keypairs', { keyPath: 'id' });
      }
    };
  });
};

// Store operations
export const dbOperations = {
  async saveKeypairs(keypairs, encryptedData) {
    const db = await initDB();
    const tx = db.transaction('keypairs', 'readwrite');
    const store = tx.objectStore('keypairs');

    await store.put({
      id: 'userKeypairs',
      data: encryptedData
    });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async getKeypairs() {
    const db = await initDB();
    const tx = db.transaction('keypairs', 'readonly');
    const store = tx.objectStore('keypairs');

    return new Promise((resolve, reject) => {
      const request = store.get('userKeypairs');
      request.onsuccess = () => resolve(request.result?.data);
      request.onerror = () => reject(request.error);
    });
  }
};