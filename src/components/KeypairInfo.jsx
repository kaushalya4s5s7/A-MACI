import { useState } from "react";
import { motion } from "framer-motion";
import { FaCopy } from "react-icons/fa";

const KeypairInfo = ({ publicKey, privateKey, label, createdAt }) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="keypair-info">
      <div className="keypair-header">
        <h4>{label || "Unlabeled Keypair"}</h4>
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
          <code>{showPrivateKey ? privateKey : "●●●●●●●●●●●●"}</code>
          <button
            className="copy-btn"
            onClick={() => copyToClipboard(privateKey)}
          >
            <FaCopy />
          </button>
          <button
            className="toggle-visibility-btn"
            onClick={() => setShowPrivateKey((prev) => !prev)}
          >
            {showPrivateKey ? "Hide" : "Show"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeypairInfo;
