# Pledgy

**Pledgy** is a goal-staking app that gamifies personal goal-setting, fostering accountability, engagement, and rewards within a secure and transparent ecosystem. It allows individuals, known as Pledgers, to set ambitious goals and back their commitment with a penalty stake. At the same time, others, known as Challengers, can participate by either supporting the Pledger's success or betting on their failure, dynamically engaging with the platform through a bonding curve mechanism.

---

## 🌟 Features

- **Pledge Goals**: Pledgers define goals with a deadline and stake penalties for failure.
- **Challenge Participation**: Challengers back or bet against Pledgers, with stakes determined by a bonding curve—early Challenges require lower contributions.
- **Dynamic Rewards**: Pledgers earn stakes and bonuses for success; Challengers share penalties for unmet goals.
- **World ID Integration**: Ensures secure and decentralized identity verification.
- **Blockchain Transparency**: All activities are recorded on-chain for full transparency.

---
## 📁 Project Structure

   ```bash
   pledgy/
├── frontend/ # Frontend application (Next.js)
│ ├── app/ # Next.js app directory
│ │ ├── api/ # API routes
│ │ └── pages/ # App pages
│ ├── components/ # React components
│ │ ├── CreatePledgy/ # Create pledge form
│ │ ├── Login/ # World ID login
│ │ └── PledgyList/ # List of pledges
│ └── config/ # Configuration files
│
└── contract/ # Smart contracts
├── contracts/ # Solidity source code
│ └── ChallengeMarket.sol # Main contract
└── scripts/ # Deployment scripts
   ```
---

## 🚀 Getting Started
### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm next dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

---

## 📖 How It Works

### For Pledgers:
1. Set a goal, define a deadline, and stake an amount as a penalty for failure.
2. Achieve the goal to earn back your stake plus bonuses from Challengers.
3. All Pledges are transparent and recorded on-chain.

### For Challengers:
1. Browse active Pledges and select a Challenge to back or bet against.
2. Stake your contribution early for lower costs or later for higher stakes (bonding curve).
3. If the Pledger fails, share the penalty with other Challengers.

### World ID:
- World ID ensures secure and privacy-focused login and identity verification for all participants.

---

## ⚙️ Technology Stack

- **Frontend**: Next.js, TypeScript
- **Blockchain**: World Chain, Solidity
- **Identity Verification**: World ID
- **Smart Contracts**: ERC-20 for staking and rewards


## 💡 Example Pledges

1. **Run for the Prize**  
   Pledger commits to running 5km daily for 30 days. Success earns rewards, failure splits stakes among Challengers.

2. **Code New Horizons**  
   Complete a full-stack blockchain course in 4 weeks. Success means growth and rewards; failure benefits the Challengers.

3. **Crypto Saver Challenge**  
   Save 0.1 ETH weekly for 10 weeks. Stick to the plan and earn, or skip a week and let Challengers win.

4. **NFT Artist Marathon**  
   Mint one new NFT weekly for 6 weeks. Meet your creative goal to earn, or let Challengers cash in on your stakes.

---

## 🔍 Explore on [Blockscout](https://www.blockscout.com/)

#### ChallengeMarket [[Contract](https://worldchain-mainnet.explorer.alchemy.com/address/0x285daba7915dEaAEdbD1D3C31a216612A2F03797)]

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---