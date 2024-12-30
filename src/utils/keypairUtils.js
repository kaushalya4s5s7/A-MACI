// Generate a simple signature (for demo purposes)
export const signMessage = (message, privateKey) => {
  return `${privateKey}_sig_${message.slice(0, 10)}`;
};

// Export keypair as JSON
export const exportKeypair = (keypair) => {
  const blob = new Blob(
    [JSON.stringify(keypair, null, 2)], 
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `keypair_${keypair.label || 'unlabeled'}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Parse imported keypair file
export const parseKeypairFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const keypair = JSON.parse(e.target.result);
        resolve(keypair);
      } catch (error) {
        reject(new Error('Invalid keypair file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};