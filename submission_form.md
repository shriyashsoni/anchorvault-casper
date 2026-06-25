# Hackathon Submission Form Details

Here is the normal, structured format you can use to copy-paste directly into your submission. I have left clear spaces for you to add your images/links and specified exactly what images to use at each point.

---

## 1. Basic Information

**BUIDL (project) name:**
AnchorVault

**BUIDL logo:**
`[IMAGE SPACE: Upload your project's logo here. It should be a JPEG or PNG, less than 2 MB. A size of 480 × 480 px is recommended.]`

**Vision (Describe the problem which this project solves):**
Cross-border payment anchors face a massive problem: Capital Inefficiency. They are forced to lock up millions of dollars just to maintain 1:1 liquidity. AnchorVault solves this by acting as a decentralized clearinghouse on the Casper Network. We pool USDC liquidity from retail providers and offer AI-managed credit lines to whitelisted Anchors using Casper's scalable WASM smart contracts. Retail earns yield from remittance volume, while institutions get the necessary capital to settle payments instantly on Casper.

**Category - Is this BUIDL an AI Agent?**
Yes *(AnchorVault utilizes the Galileo AI Copilot to constantly analyze Anchor reputation, pool utilization, and ledger data to autonomously adjust credit limits and protect LP capital.)*

---

## 2. Links

**GitHub/Gitlab/Bitbucket:**
https://github.com/shriyashsoni/anchorvault

**Project website (optional):**
https://www.anchorvault.xyz

**Demo video:**
`[LINK SPACE: Insert the link to your YouTube demo video here]`

**Social links:**
1. https://x.com/shriyashsoni_
2. https://x.com/Anchor_Vault
3. `[LINK SPACE: Insert your third social link here, e.g., LinkedIn or a Farcaster account if you have one]`

---

## 3. Detailed Project Description & How We Built It
*(You can use this for the "Project Description" or Readme section of the submission)*

### Overview
AnchorVault is a production-grade, decentralized liquidity protocol built natively on the **Casper Network**. It bridges Liquidity Providers (LPs) with authorized off-ramp payment anchors to facilitate instant, cross-border remittances with predictable gas fees.

`[IMAGE SPACE: Upload the AnchorVault Dashboard UI screenshot here]`
*(Screenshot instructions: Take a screenshot of the main page or LP Dashboard of your web app showing the dark-mode glassmorphism UI, TVL, and deposit options.)*

### Core Working Functionality & How We Built It
We engineered AnchorVault using a modular Rust smart contract architecture on Casper, connecting three main on-chain entities trustlessly using Casper Dictionaries for scalable state mapping.

**1. Corridor Pool Vault (anchor_vault)**
We built the core vault where LPs deposit USDC (CEP-18 standard) to earn interest from global cross-border remittances. When USDC is deposited, the contract mints **$AVLT** share tokens for the user. We implemented a dynamic yield accrual mechanism: as anchors repay their draws plus interest, 90% of the settlement fee is added to the accumulated fees per share, which is then dynamically routed to LPs.

**2. Anchor Registry (anchor_registry)**
To manage risk, we built an Anchor Registry using Casper Dictionaries to track scores. Before drawing capital, anchors must undergo whitelisting. They are required to lock up governance $VAULT tokens as collateral. Our system enforces a strict 10% minimum collateral-to-credit ratio. 

**3. On-chain Reputation System & AI Copilot**
We integrated a reputation tracking system driven by our AI Copilot. Successful repayments boost the anchor's score, increasing their credit capacity. Defaults or alerts trigger an automatic score slash, instantly restricting their borrowing power to protect LP funds.

`[IMAGE SPACE: Upload the Protocol Architecture Flowchart here]`
*(Screenshot instructions: Use a tool to render the mermaid diagrams from your README or take a screenshot of your architecture diagram showing how the LP, Vault, and Anchor interact.)*

### Dynamic Interest & Fee Model
To protect liquidity, we built a **Two-Slope Utilization Curve**:
*   **Normal Range (Utilization ≤ 80%):** Interest fees scale moderately (Base 1% + Slope 4%).
*   **Penalty Range (Utilization > 80%):** Fees scale aggressively up to 50% to discourage further draws and incentivize anchors to repay their loans, restoring capital to the pool.

### Tech Stack
*   **Blockchain:** Casper Network Testnet (Predictable gas, upgradable contracts)
*   **Smart Contracts:** Casper Rust SDK / WASM
*   **Frontend:** React, TypeScript, Vite, Vanilla CSS with Glassmorphism
*   **Wallet Integration:** Casper Wallet (casper-js-sdk)
*   **Stablecoin:** USDC (CEP-18 Standard)
*   **RPC & Tooling:** Casper Testnet Node, CSPR.live Explorer

### Deployed Smart Contracts (Casper Testnet)
*We have successfully integrated the Casper Wallet to sign deploy transactions on testnet.*
*   **Casper USDC Stablecoin (CEP-18):** `103fcc98fd1eb7fcd3c204683d4ff438665dcd33b486564cd46cc90d6db7344f`
*   **Vault Share Token ($AVLT):** `25b57f2e9e9786f0abeb990c4329338d8292f7ef9d571fb35f8db5f650b8d6c5`
*   **Anchor Registry:** `39871211df19ae9474be579ebbf695589d544ae7ef60243fbe2554d3d686eed7`
*   **Corridor Pool Core Vault:** `814117b2cb4f5b63a8ba1f5abb0bbfd11b576fd2b7bbaf23a101b74dbbbfeb4c`

---
