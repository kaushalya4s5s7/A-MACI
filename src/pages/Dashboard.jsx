import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { logout } from "../utils/auth";
import {
  signMessage,
  exportKeypair,
  parseKeypairFile,
} from "../utils/keypairUtils";
import { useKeypairStorage } from "../hooks/useKeypairStorage";
import KeypairInfo from "../components/KeypairInfo";
import KeypairStatus from "../components/KeypairStatus";
import KeypairForm from "../components/KeypairForm";
import MessageSigner from "../components/MessageSigner";
import MatrixRain from "../components/MatrixRain";

const splitKey = (key, totalParts = 5) => {
  const parts = [];
  const partSize = Math.floor(key.length / totalParts);

  for (let i = 0; i < totalParts; i++) {
    parts.push(key.substr(i * partSize, partSize));
  }

  return parts;
};

const saveInIndexedDB = (part, index) => {
  const dbRequest = indexedDB.open("keyPairsDB", 1);

  dbRequest.onupgradeneeded = () => {
    const db = dbRequest.result;
    if (!db.objectStoreNames.contains("keyParts")) {
      db.createObjectStore("keyParts", { keyPath: "index" });
    }
  };

  dbRequest.onsuccess = () => {
    const db = dbRequest.result;
    const transaction = db.transaction("keyParts", "readwrite");
    const store = transaction.objectStore("keyParts");
    store.put({ index, part });
  };

  dbRequest.onerror = (error) => {
    console.error("Error storing key part in IndexedDB:", error);
  };
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [keypairs, saveKeypairs] = useKeypairStorage();
  const [activeKeypairIds, setActiveKeypairIds] = useState([]);
  const [editingKeypairId, setEditingKeypairId] = useState(null);
  const [status, setStatus] = useState("none");
  const [signedMessage, setSignedMessage] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [keyPartsLocations, setKeyPartsLocations] = useState([]);
  const fileInputRef = useRef(null);

  const generateKeypair = () => {
    const privateKey = "priv_" + Math.random().toString(36).substr(2, 18);

    // Split the key into 5 parts
    const keyParts = splitKey(privateKey, 5);

    // Store the first 3 parts in IndexedDB
    keyParts.slice(0, 3).forEach((part, index) => saveInIndexedDB(part, index));

    // Simulate the remaining 2 parts being stored elsewhere
    const partsLocations = keyParts.map((part, index) =>
      index < 3
        ? `Part ${index + 1}: Stored in IndexedDB`
        : `Part ${index + 1}: To be stored on a secure server`
    );

    const newKeypair = {
      id: Date.now().toString(),
      publicKey: "ed25519_" + Math.random().toString(36).substr(2, 9),
      privateKey,
      label: "",
      status: "active",
      createdAt: new Date().toISOString(),
    };

    const updatedKeypairs = [...keypairs, newKeypair];
    saveKeypairs(updatedKeypairs);
    setActiveKeypairIds([...activeKeypairIds, newKeypair.id]);
    setKeyPartsLocations(partsLocations);
    setStatus("active");
  };

  const handleLabelSave = (keypairId, label) => {
    const updatedKeypairs = keypairs.map((kp) =>
      kp.id === keypairId ? { ...kp, label } : kp
    );
    saveKeypairs(updatedKeypairs);
    setEditingKeypairId(null);
  };

  const discardSelectedKeypairs = () => {
    const updatedKeypairs = keypairs.map((kp) =>
      activeKeypairIds.includes(kp.id) ? { ...kp, status: "discarded" } : kp
    );
    saveKeypairs(updatedKeypairs);
    setStatus("discarded");

    setTimeout(() => {
      const filteredKeypairs = keypairs.filter(
        (kp) => !activeKeypairIds.includes(kp.id)
      );
      saveKeypairs(filteredKeypairs);
      setActiveKeypairIds([]);
      setStatus("none");
    }, 2000);
  };

  const handleExportSelected = () => {
    activeKeypairIds.forEach((id) => {
      const keypair = keypairs.find((kp) => kp.id === id);
      if (keypair) {
        exportKeypair(keypair);
      }
    });
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const importedKeypair = await parseKeypairFile(file);
      const newKeypair = {
        ...importedKeypair,
        id: Date.now().toString(),
        status: "active",
        createdAt: new Date().toISOString(),
      };

      const updatedKeypairs = [...keypairs, newKeypair];
      saveKeypairs(updatedKeypairs);
      setActiveKeypairIds([...activeKeypairIds, newKeypair.id]);
      setStatus("active");
    } catch (error) {
      console.error("Failed to import keypair:", error);
    }

    event.target.value = "";
  };

  const handleSignMessage = (message) => {
    const signatures = activeKeypairIds.map((id) => {
      const keypair = keypairs.find((kp) => kp.id === id);
      return keypair ? signMessage(message, keypair.privateKey) : null;
    });
    setSignedMessage(signatures.join("\n"));
    setConfirmationMessage("Key has successfully signed the message.");

    // Clear the confirmation message after a few seconds
    setTimeout(() => setConfirmationMessage(""), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard">
      <MatrixRain />
      <nav className="dashboard-nav">
        <h2>A-MACI Dashboard</h2>
        <button className="btn btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        <motion.div
          className="card keypair-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Keypair Management</h3>
          {status !== "none" && <KeypairStatus status={status} />}

          <div className="keypair-actions">
            <button
              className="btn"
              onClick={generateKeypair}
              disabled={status === "active"}
            >
              Generate New Keypair
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              style={{ display: "none" }}
            />
            <button
              className="btn btn-import"
              onClick={() => fileInputRef.current?.click()}
            >
              Import Keypair
            </button>
            <button
              className="btn btn-danger"
              onClick={discardSelectedKeypairs}
              disabled={activeKeypairIds.length === 0}
            >
              Discard Selected Keypairs
            </button>
            <button
              className="btn"
              onClick={handleExportSelected}
              disabled={activeKeypairIds.length === 0}
            >
              Export Selected Keypairs
            </button>
          </div>

          {keypairs.map((keypair) => (
            <motion.div
              key={keypair.id}
              className="keypair-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <KeypairInfo {...keypair} />
              <input
                type="checkbox"
                checked={activeKeypairIds.includes(keypair.id)}
                onChange={(e) =>
                  setActiveKeypairIds(
                    e.target.checked
                      ? [...activeKeypairIds, keypair.id]
                      : activeKeypairIds.filter((id) => id !== keypair.id)
                  )
                }
              />
              <button
                className="btn btn-edit-label"
                onClick={() => setEditingKeypairId(keypair.id)}
              >
                Edit Label
              </button>
              {editingKeypairId === keypair.id && (
                <KeypairForm
                  onSave={(label) => handleLabelSave(keypair.id, label)}
                />
              )}
            </motion.div>
          ))}

          {keyPartsLocations.length > 0 && (
            <div className="key-parts-locations">
              <h3>Key Parts Distribution</h3>
              <ul>
                {keyPartsLocations.map((location, index) => (
                  <li key={index}>{location}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {keypairs.length > 0 && (
          <MessageSigner
            keypairs={keypairs}
            onSign={(message) => handleSignMessage(message)}
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
            {confirmationMessage && (
              <p className="confirmation-message">{confirmationMessage}</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
