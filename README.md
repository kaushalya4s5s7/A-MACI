# A-MACI Dashboard

The **A-MACI Dashboard** is a cutting-edge Web3 solution designed for secure cryptographic keypair management. It seamlessly integrates advanced cryptographic techniques like the A-MACI protocol with a user-friendly interface, ensuring both security and an immersive user experience.

## Table of Contents
- [Features](#features)
  - [Core Functionalities](#core-functionalities)
  - [Functional Features](#functional-features)
  - [Security Features](#security-features)
  - [Interactive UI/UX](#interactive-uiux)
- [Technical Overview](#technical-overview)
- [Installation](#installation)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Future Improvements](#future-improvements)
- [License](#license)

## Features

### Core Functionalities
- **Keypair Management**: Secure generation, storage, and distribution of cryptographic keys.
- **A-MACI Integration**: Enhances Anonymous Message Authentication with cryptographic integrity.
- **User Experience**: Interactive UI with responsive components and animations.

### Functional Features
#### Keypair Generation & Management
- **Generation**: Secure cryptographic keypair generation.
- **Distribution**: Splits private keys into five parts; three parts stored in IndexedDB, and two on secure servers.
- **Status**: Keypairs categorized as `active`, `discarded`, or `imported`.

#### Keypair Operations
- **Export**: Export keypairs in JSON format for backup.
- **Import**: Import previously exported keypairs into the system.
- **Discard**: Securely discard keypairs and update their status.

#### Message Signing
- Sign messages using active private keys for secure cryptographic operations.

### Security Features
- **Key Splitting**: Private key split into five parts for enhanced security.
- **IndexedDB Transactions**: Reliable storage for key parts locally.
- **A-MACI Protocol**: Ensures cryptographic integrity for anonymous operations.
- **Web3 Wallet Integration**: Wallet-based authentication.

### Interactive UI/UX
- **Matrix Rain Animation**: A thematic Web3-inspired visual element.
- **Framer Motion**: Smooth and dynamic UI transitions.
- **Dark Theme**: A sleek aesthetic aligning with Web3 themes.

## Technical Overview
- **Frontend**: React.js, Framer Motion, IndexedDB for local storage.
- **Backend**: A-MACI Protocol and custom keypair utilities.
- **File Management**: JSON export/import modules for key backup and restoration.

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/kaushalya4s5s7/A-MACI.git
   cd A-MACI
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```
4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Usage

1. **Generate a Keypair**: Use the interface to generate a secure cryptographic keypair.
2. **Manage Keypairs**:
   - View active, discarded, or imported keypairs.
   - Export keypairs in JSON format for backup.
   - Import previously exported keypairs.
   - Discard keypairs securely.
3. **Sign Messages**: Select an active keypair to sign messages.
4. **Visualize Key Distribution**: Monitor where key parts are stored (locally or remotely).

## How It Works
1. **Keypair Generation**:
   - Generate a keypair and split the private key into five parts.
   - Store three parts locally in IndexedDB for offline access, while two parts are stored on secure servers.
2. **Managing Keypairs**:
   - View, export, discard, or import keypairs through the dashboard.
3. **Signing Messages**:
   - Use the private key of an active keypair to sign cryptographic messages securely.
4. **Security Measures**:
   - Key splitting ensures partial local and remote storage for added security.
   - IndexedDB provides offline accessibility.

## Future Improvements
- Multi-device synchronization for keypairs.
- Real-time updates for key status and operations.
- Enhanced analytics and visualizations for key management.


---

We welcome feedbacks! For more information, contact us at [chaudharikaushal02@gmail.com].
