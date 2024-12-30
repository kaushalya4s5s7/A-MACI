import { useState } from 'react';
import { motion } from 'framer-motion';

const KeypairForm = ({ onSave }) => {
  const [label, setLabel] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) return;
    onSave(label);
    setLabel('');
  };

  return (
    <form onSubmit={handleSubmit} className="keypair-form">
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Enter keypair label"
        className="keypair-input"
      />
      <button type="submit" className="btn">Save Label</button>
    </form>
  );
}

export default KeypairForm;