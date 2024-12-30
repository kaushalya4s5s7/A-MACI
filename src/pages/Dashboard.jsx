import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { logout } from '../utils/auth';
import { signMessage, exportKeypair, parseKeypairFile } from '../utils/keypairUtils';
import { useKeypairStorage } from '../hooks/useKeypairStorage';
import KeypairInfo from '../components/KeypairInfo';
import KeypairStatus from '../components/KeypairStatus';
import KeypairForm from '../components/KeypairForm';
import MessageSigner from '../components/MessageSigner';
import MatrixRain from '../components/MatrixRain';

const Dashboard = () => {
  const navigate = useNavigate();
  const [keypairs, saveKeypairs] = useKeypairStorage();
  const [activeKeypairId, setActiveKeypairId] = useState(null);
  const [status, setStatus] = useState('none');
  const [signedMessage, setSignedMessage] = useState('');
  const fileInputRef = useRef(null);

  const generateKeypair = () => {
    const newKeypair = {
      id: Date.now().toString(),
      publicKey: 'ed25519_' + Math.random().toString(36).substr(2, 9),
      privateKey: 'priv_' + Math.random().toString(36).substr(2, 9),
      label: '',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    const updatedKeypairs = [...keypairs, newKeypair];
    saveKeypairs(updatedKeypairs);
    setActiveKeypairId(newKeypair.id);
    setStatus('active');
  };

  const handleLabelSave = (label) => {
    const updatedKeypairs = keypairs.map(kp => 
      kp.id === activeKeypairId ? { ...kp, label } : kp
    );
    saveKeypairs(updatedKeypairs);
  };

  const discardKeypair = (keypairId) => {
    const updatedKeypairs = keypairs.map(kp =>
      kp.id === keypairId ? { ...kp, status: 'discarded' } : kp
    );
    saveKeypairs(updatedKeypairs);
    setStatus('discarded');
    
    setTimeout(() => {
      const filteredKeypairs = keypairs.filter(kp => kp.id !== keypairId);
      saveKeypairs(filteredKeypairs);
      setActiveKeypairId(null);
      setStatus('none');
    }, 2000);
  };

  const handleExport = (keypairId) => {
    const keypair = keypairs.find(kp => kp.id === keypairId);
    if (keypair) {
      exportKeypair(keypair);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const importedKeypair = await parseKeypairFile(file);
      const newKeypair = {
        ...importedKeypair,
        id: Date.now().toString(),
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      const updatedKeypairs = [...keypairs, newKeypair];
      saveKeypairs(updatedKeypairs);
      setActiveKeypairId(newKeypair.id);
      setStatus('active');
    } catch (error) {
      console.error('Failed to import keypair:', error);
      // You might want to show an error message to the user here
    }
    
    // Reset file input
    event.target.value = '';
  };

  const handleSignMessage = (keypairId, message) => {
    const keypair = keypairs.find(kp => kp.id === keypairId);
    if (keypair) {
      const signature = signMessage(message, keypair.privateKey);
      setSignedMessage(signature);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard">
      <MatrixRain />
      <nav className="dashboard-nav">
        <h2>A-MACI Dashboard</h2>
        <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="dashboard-content">
        <motion.div 
          className="card keypair-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Keypair Management</h3>
          {status !== 'none' && <KeypairStatus status={status} />}
          
          <div className="keypair-actions">
            <button 
              className="btn"
              onClick={generateKeypair}
              disabled={status === 'active'}
            >
              Generate New Keypair
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              style={{ display: 'none' }}
            />
            <button 
              className="btn btn-import"
              onClick={() => fileInputRef.current?.click()}
            >
              Import Keypair
            </button>
          </div>

          {keypairs.map(keypair => (
            <motion.div
              key={keypair.id}
              className="keypair-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <KeypairInfo {...keypair} />
              {keypair.id === activeKeypairId && (
                <KeypairForm onSave={handleLabelSave} />
              )}
              <div className="keypair-actions">
                <button
                  className="btn"
                  onClick={() => handleExport(keypair.id)}
                >
                  Export
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => discardKeypair(keypair.id)}
                >
                  Discard
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {keypairs.length > 0 && (
          <MessageSigner
            keypairs={keypairs}
            onSign={handleSignMessage}
          />
        )}

        {signedMessage && (
          <motion.div
            className="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3>Signed Message</h3>
            <pre className="signed-message">{signedMessage}</pre>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;