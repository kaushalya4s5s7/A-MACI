import { useState } from 'react';
import { motion } from 'framer-motion';

const MessageSigner = ({ keypairs, onSign }) => {
  const [message, setMessage] = useState('');
  const [selectedKeypairId, setSelectedKeypairId] = useState('');

  const handleSign = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedKeypairId) return;
    onSign(selectedKeypairId, message);
    setMessage('');
  };

  return (
    <motion.div
      className="card message-signer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>Sign Message</h3>
      <form onSubmit={handleSign}>
        <select
          value={selectedKeypairId}
          onChange={(e) => setSelectedKeypairId(e.target.value)}
          className="keypair-select"
        >
          <option value="">Select a keypair</option>
          {keypairs.map(kp => (
            <option key={kp.id} value={kp.id}>
              {kp.label || 'Unlabeled Keypair'}
            </option>
          ))}
        </select>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message to sign"
          className="message-input"
        />
        <button 
          type="submit" 
          className="btn"
          disabled={!message.trim() || !selectedKeypairId}
        >
          Sign Message
        </button>
      </form>
    </motion.div>
  );
}

export default MessageSigner;