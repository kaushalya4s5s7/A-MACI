import { motion } from 'framer-motion';
import { FaCopy } from 'react-icons/fa';

const KeypairInfo = ({ publicKey, privateKey, label, createdAt }) => {
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You might want to show a success message here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="keypair-info">
      <div className="keypair-header">
        <h4>{label || 'Unlabeled Keypair'}</h4>
        <span className="keypair-date">
          Created: {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <div className="key-field">
        <label>Public Key</label>
        <div className="key-value">
          <code>{publicKey}</code>
          <button
            className="copy-btn"
            onClick={() => copyToClipboard(publicKey)}
          >
            <FaCopy />
          </button>
        </div>
      </div>

      <div className="key-field">
        <label>Private Key</label>
        <div className="key-value">
          <code>{privateKey}</code>
          <button
            className="copy-btn"
            onClick={() => copyToClipboard(privateKey)}
          >
            <FaCopy />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeypairInfo;