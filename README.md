# 🛡️ Abyssos – AI-Powered Scam Detection on Avalanche

**Abyssos** is an AI-driven, on-chain intelligence platform designed to detect and evaluate potential crypto scams by analyzing both on-chain and off-chain data. Built on the Avalanche blockchain, Abyssos empowers users to analyze wallets, tokens, and crypto projects using an intelligent scoring system, transparency through decentralization, and user-owned analysis reports as tradable NFTs.

> ⚡ This project is a submission for the **Avalanche Summit Hackathon – London 2025**.

---

## 🚀 What is Abyssos?

Abyssos currently implements and plans to expand with these powerful components:

1. **Current Implementation**:
   - **On-Chain Analysis (mock-data right now)**: Comprehensive risk assessment of blockchain projects by analyzing:
     - Wallet age and transaction history
     - Contract verification status
     - Token minting capabilities
     - Owner control features
     - Interaction with known risky contracts
   - **AI Assistant**: An intelligent chat interface that:
     - Explains risk factors in detail
     - Provides context for each risk score
     - Answers questions about the analysis
     - Suggests additional security considerations

2. **Future Components** (Planned):
   - **Advanced AI Agent**: Will scrape and analyze data from:
     - Avalanche on-chain activity patterns
     - Token behavior metrics
     - Project website analysis
     - Social media presence and engagement
     - Known scam pattern recognition
     - Community sentiment analysis

   - **Decentralized Report Registry**:
     - Store analysis results on Avalanche blockchain
     - Mint reports as unique NFTs
     - Reward system for insightful analysis creators
     - Premium access to curated high-confidence evaluations

3. **Smart Risk Scoring** (Current & Future):
   - Current: Detailed risk score (0-100) with:
     - Technical risk factors
     - Contract security analysis
     - Wallet behavior patterns
   - Future: Enhanced scoring with:
     - Community-level insights
     - Social media sentiment
     - Historical scam pattern matching
     - Real-time threat detection

---

## 🧠 Key Features

- ✅ AI-powered scam detection & classification
- 📡 Integration with Avalanche blockchain
- 🔐 User-owned analysis via NFTs
- 🪙 Tokenized access & reward system
- 💡 Transparency, traceability, and crowdsourced knowledge

---

## 🏗️ Tech Stack

- **Frontend**: React + TypeScript + Vite (Browser Extension and Web App)
- **Backend**: Node.js + Express (API & orchestration)
- **AI Layer**: Custom LLM or finetuned model for scam detection, powered by historical crypto data
- **Blockchain**: Avalanche C-Chain or a dedicated Subnet for scalability
- **Smart Contracts**: ERC-721 (NFTs), optional token system for membership/rewards

---

## 🎯 Why Avalanche?

- 🔥 Low fees and fast finality
- 🧩 Subnet support for custom scalability
- 💬 Native support for dApp developers and vibrant ecosystem
- 🌍 Aligned with our goal of real-time on-chain analysis and decentralized storage

---

## 📘 Future Vision

Abyssos aims to become the go-to reputation and intelligence layer for crypto wallet evaluation. Over time, it will evolve into a collaborative threat detection network powered by user-generated analysis, smart AI agents, and decentralized consensus.

---

## 🤝 Team

Created with passion during the **Avalanche Summit Hackathon, London 2025**.

---

## 🚀 Development & Production

### Prerequisites
- Node.js >= 18
- pnpm >= 8
- Core Wallet browser extension

### Installation
1. **Install pnpm** (if not installed):
```bash
npm install -g pnpm
```

2. **Clone the repository**:
```bash
git clone <repository-url>
cd Abyssos
```

3. **Install backend dependencies**:
```bash
cd apps/backend
pnpm install
```

4. **Install frontend dependencies**:
```bash
cd ../frontend
pnpm install
```

### Running the Application
5. **Start the backend**:
```bash
cd apps/backend
pnpm run dev
```
The backend will run on `http://localhost:1234`

6. **Start the frontend** (in a new terminal):
```bash
cd apps/frontend
pnpm run dev
```
The frontend will run on `http://localhost:3000`

7. **Verify the installation**:
   - Open `http://localhost:3000` in your browser
   - Ensure Core Wallet is installed
   - Click "Connect Wallet" in the navigation bar
   - Test the analysis with a wallet address

### Project Structure
```
Abyssos/
├── apps/
│   ├── backend/
│   │   ├── package.json
│   │   └── src/
│   └── frontend/
│       ├── package.json
│       └── src/
```

### Troubleshooting
#### Common Issues
- **Wallet connection issues**: Ensure Core Wallet is installed
- **Dependency errors**: Run `pnpm install` in both directories

#### Useful Commands
```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
pnpm install --force

# View backend logs
cd apps/backend && pnpm run dev

# View frontend logs
cd apps/frontend && pnpm run dev
```

### Important Notes
- The backend must be running before starting the frontend
- Ensure ports 1234 (backend) and 3000 (frontend) are available
- Have Core Wallet installed and configured in your browser (optional)
- Keep both terminal windows open while developing

### Features
- Wallet connection with Core Wallet
- Blockchain analysis for addresses, transactions, and tokens
- Risk assessment and scoring
- Chat interface for detailed analysis
- Analysis history with export functionality
- Real-time data updates

### Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License – free to use, contribute and extend.