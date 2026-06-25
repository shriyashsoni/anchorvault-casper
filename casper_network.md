# AnchorVault — Casper Network Integration

AnchorVault is migrating its production-grade decentralized liquidity protocol to the **Casper Network**. The UI/UX, AI agent capabilities, and core remittance business logic remain identical to the original Casper implementation, but the underlying smart contract architecture and network infrastructure have been completely rebuilt natively for Casper.

Here are the **Top 10 Features & Architectural Shifts** driving the AnchorVault protocol on Casper:

## 1. Native Casper WASM Smart Contracts
The `Casper WASM-sdk` has been fully replaced with `casper-contract` and `casper-types`. The 3 core Rust contracts (Anchor Vault, Anchor Registry, and Vault Token) now compile seamlessly into Casper WebAssembly (`wasm32-unknown-unknown`), leveraging Casper's highly optimized runtime.

## 2. Advanced State Management via Dictionaries
Instead of traditional flat persistent storage, AnchorVault on Casper utilizes **Casper Dictionaries** (`storage::new_dictionary`). This provides hyper-scalable $O(1)$ lookups for thousands of Liquidity Providers (LPs) and Anchors without bloating the global state tree.

## 3. CEP-18 Token Integration (Casper's ERC-20 Equivalent)
The protocol abandons the Casper native USDC client in favor of Casper's **CEP-18 Fungible Token Standard**. All corridor pool stablecoin reserves and Vault Governance Tokens ($AVLT) are minted, burned, and transferred using Casper's highly secure `ContractRef` purse mechanisms.

## 4. Casper Wallet Native Connection
The Casper Wallet wallet integration has been stripped out. The frontend now natively hooks into the **Casper Wallet** browser extension (`window.casperlabsHelper`), allowing users to securely sign `Deploy` transactions using their Casper Public Keys (Hex).

## 5. Predictable Gas & Compute
Casper's gas model is deterministic. Our complex **Two-Slope Utilization Curve** (which calculates dynamic interest rates based on pool liquidity) executes with predictable, fixed compute costs, ensuring LPs never face sudden fee spikes during high network congestion.

## 6. Upgradability by Default
Unlike immutable contracts on older chains, the Casper Network has native smart contract upgradability built into the protocol layer. As AnchorVault scales, we can instantly patch the `Anchor Registry` or `Vault` logic (such as adjusting the collateral ratio from 10% to 15%) without disrupting LP funds or active anchor draws.

## 7. AI Agent Casper Integration
The AnchorVault Twitter Growth AI Agent (`twitter-agent/ai.js`) has been updated to comprehend Casper ecosystem terminology. It can now autonomously monitor the Casper blockchain, fetch on-chain metrics, and tweet updates about AnchorVault's liquidity pools to engage the broader Casper community.

## 8. Cryptographic Alignment (Ed25519 & Secp256k1)
All transaction signing logic in the backend Node.js deployment scripts (`deploy.js`, `mint_usdc.js`) now utilizes the `casper-js-sdk` to generate and verify signatures natively compliant with Casper nodes.

## 9. Frictionless Remittance UI/UX
The liquid-glass themed DeFi dashboard built with React + Vite remains 100% intact. The complex Casper blockchain interactions are abstracted away. LPs experience the exact same sleek, dark-mode animations when depositing liquidity as they did on the previous chain.

## 10. Automated Reputational Scoring on Casper
The on-chain Anchor Reputation System (0-1000 score) is now securely managed inside a Casper Dictionary. Faster repayment of Casper stablecoin draws instantly updates the Anchor's credit score, expanding their borrowing limit with zero human intervention required.
