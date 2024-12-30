import { motion } from 'framer-motion';

const KeypairStatus = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'var(--primary-green)';
      case 'discarded': return 'var(--error-red)';
      default: return 'var(--soft-white)';
    }
  };

  return (
    <motion.div 
      className="keypair-status"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="status-indicator" style={{ backgroundColor: getStatusColor() }} />
      <span>Status: {status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </motion.div>
  );
};

export default KeypairStatus;