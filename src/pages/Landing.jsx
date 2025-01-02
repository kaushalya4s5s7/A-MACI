import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MatrixRain from "../components/MatrixRain";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <MatrixRain />
      <motion.div
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1>Aegis Key</h1>
        <p>Secure, Anonymous, Decentralized</p>
        <motion.button
          className="btn"
          onClick={() => navigate("/dashboard")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>

        <div className="info-section card">
          <h2>What is A-MACI?</h2>
          <p>
            A-MACI (Anonymous Minimal Anti-Collusion Infrastructure) is a
            revolutionary solution for decentralized governance, ensuring
            privacy and preventing collusion in voting systems.
          </p>
          <ul>
            <li>Secure EdDSA-based keypairs</li>
            <li>Anonymous voting mechanisms</li>
            <li>Trustless verification</li>
            <li>Privacy-preserving results</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
