# 🛡️ Abyssos – AI-Powered Scam Detection on Avalanche

**Abyssos** is an AI-driven, on-chain intelligence platform designed to detect and evaluate potential crypto scams by analyzing both on-chain and off-chain data. Built on the Avalanche blockchain, Abyssos empowers users to analyze wallets, tokens, and crypto projects using an intelligent scoring system, transparency through decentralization, and user-owned analysis reports as tradable NFTs.

> ⚡ This project is a submission for the **Avalanche Summit Hackathon – London 2025**.

---

## 🚀 What is Abyssos?

Abyssos combines three powerful components:
1. **Artificial Intelligence Agent**: Scrapes and analyzes data from:
   - Avalanche on-chain activity
   - Token behavior
   - Project websites
   - Twitter/X profiles and engagement
   - Known scam patterns and community signals

2. **Smart Risk Scoring**: Outputs a scam **risk score (0-10)** along with:
   - 🧠 Technical summary
   - 🌐 Community-level insights
   - 🔍 Surface-level overview

3. **Decentralized Report Registry**:
   - Each analysis is stored on Avalanche.
   - Reports are minted as **unique NFTs**.
   - Users who generate insightful reports can earn token/NFT rewards every time their analysis is accessed.
   - Premium users can access a curated set of high-confidence project evaluations.

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

### Installation
```bash
# Install all dependencies
pnpm install
```

### Development
```bash
# Start frontend development server
pnpm --filter @abyssos/frontend dev

# Start backend development server
pnpm --filter @abyssos/backend dev

# Watch and build shared packages
pnpm --filter @abyssos/core dev
pnpm --filter @abyssos/ai-agent dev
pnpm --filter @abyssos/blockchain-sdk dev
pnpm --filter @abyssos/types dev
```

### Production Build
```bash
# Build all packages and apps
pnpm build

# Build specific package
pnpm --filter @abyssos/frontend build
pnpm --filter @abyssos/backend build
```

### Testing
```bash
# Run all tests
pnpm test

# Test specific package
pnpm --filter @abyssos/frontend test
```

---

## 📄 License

MIT License – free to use, contribute and extend.